import { Chat } from '../entities/chat/chat.entity'
import { AppDataSource } from '../config/database.config'
import { User } from '../entities/user/user.entity'
import HttpException from '../utils/HttpException.utils'
import { Room } from '../entities/chat/room.entity'
import { Travel } from '../entities/travels/travel.entity'
import { Guide } from '../entities/guide/guide.entity'
import { ChatDTO } from '../dto/chat.dto'
import { RoomService } from "../service/room.service";
import { io } from '../socket/socket'

const roomService = new RoomService()

 export class ChatService {
  constructor(
    private readonly chatRepo = AppDataSource.getRepository(Chat),
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly roomRepo = AppDataSource.getRepository(Room),
    private readonly travelRepo = AppDataSource.getRepository(Travel),
    private readonly guideRepo = AppDataSource.getRepository(Guide),
  ) {}


  async chatWithGuide(userId:string, guideId:string, data:ChatDTO){

    try {
      const user = await this.userRepo.findOneBy({ id: userId })
      if (!user) throw HttpException.unauthorized("You are not authorized")

      const receiver = await this.guideRepo.findOneBy({ id: guideId })
      if (!receiver) throw HttpException.notFound("Guide not found")
const getRoom = await roomService.checkRoomWithGuide(userId, guideId)
      if(!getRoom) throw HttpException.notFound("Room not found")
      const room = await this.roomRepo.findOneBy({ id: getRoom.id })
      if (!room) throw HttpException.notFound('room not found')   
        
        const chat = this.chatRepo.create({
          message:data.message,
          room:room,
          receiverGuide:receiver,
          senderUser:user

        })
       const saveChat =  await this.chatRepo.save(chat)
const getChats = await this.chatRepo.findBy({receiverGuide:{id:guideId}})
io.to(guideId).emit("message", getChats)
       return saveChat
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }
  async chatWithTravel(userId:string, travelId:string, data:ChatDTO){

    try {
      const user = await this.userRepo.findOneBy({ id: userId })
      if (!user) throw HttpException.unauthorized("You are not authorized")

      const receiver = await this.travelRepo.findOneBy({ id: travelId })
      if (!receiver) throw HttpException.notFound("Guide not found")
const getRoom = await roomService.checkRoomWithTravel(userId, travelId)
      if(!getRoom) throw HttpException.notFound("Room not found")
      const room = await this.roomRepo.findOneBy({ id: getRoom.id })
      if (!room) throw HttpException.notFound('room not found')   
        
        const chat = this.chatRepo.create({
          message:data.message,
          room:room,
          receiverTravel:receiver,
          senderUser:user

        })
        console.log("🚀 ~ ChatService ~ chatWithTravel ~ chat:", chat)
       const saveChat =  await this.chatRepo.save(chat)
// const getChats = await this.chatRepo.find({where:{receiverTravel:{id:travelId}}, relations:['receiverUser','receiverGuide','receiverTravel','senderTravel','senderGuide','senderUser']})
// io.to(travelId).emit("message", getChats)
//        console.log("🚀 ~ ChatService ~ chatWithTravel ~ getChats:", getChats)
       return chat
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError;
      }
    }
  }


  async displayChat(userId: string, receiverId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId })
      if (!user) throw HttpException.unauthorized

      const chats = await this.chatRepo.find({
        where: [
          { senderGuide: { id: userId }, receiverUser: { id: receiverId } },
          { senderUser: { id: receiverId }, receiverGuide: { id: userId } },
        ],
        relations: ['sender', 'receiver', 'sender.details', 'receiver.details'],
        order: { createdAt: 'ASC' },
      })
      if (!chats) throw HttpException.notFound
      return chats
      
    } catch (error) {
      console.log('🚀 ~ ChatService ~ displayChat ~ error:', error)
      throw error
    }
  }

  async getChatByUserOfTravel(user_id:string, travel_id:string) {
    try {
      const user = await this.userRepo.findOneBy({id:user_id})
      if(!user) throw HttpException.unauthorized("You are not authorized")
  
        const chats = await this.chatRepo.find({
          where: [
            { senderTravel: { id: user_id }, receiverUser: { id: travel_id } },
            { senderUser: { id: user_id }, receiverTravel: { id: travel_id } },
          ],
          relations: ['receiverTravel', 'receiverUser', 'senderUser', 'senderTravel'],
          order: { createdAt: 'ASC' },
        })
        console.log("🚀 ~ ChatService ~ getChatByUserOfTravel ~ chats:", chats)
        if (!chats) throw HttpException.notFound
        return chats
    } catch (error:unknown) {
      if(error instanceof Error)
      throw HttpException.badRequest(error.message)
    }
    }
}
