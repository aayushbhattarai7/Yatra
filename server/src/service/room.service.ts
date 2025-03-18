import { Room } from '../entities/chat/room.entity'
import { AppDataSource } from '../config/database.config'
import HttpException from '../utils/HttpException.utils'
import { User } from '../entities/user/user.entity'

export class RoomService {
  constructor(
    private readonly roomrepo = AppDataSource.getRepository(Room),
    private readonly userRepo = AppDataSource.getRepository(User)
  ) {}
  async checkRoomWithTravel(userId: string, receiverId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId })
      if (!user) return null

      const receiver = await this.userRepo.findOneBy({ id: receiverId })
      if (!receiver) return null

      const findRoom = await this.roomrepo.findOne({
        where: [
          { user: { id: userId }, travel: { id: receiverId } },
          { travel: { id: receiverId }, user: { id: userId } },
        ],
      })
      if (!findRoom) {
      const createRoom = this.roomrepo.create({
user:user,
travel:receiver
      })
      await this.roomrepo.save(createRoom)
      return createRoom
      }
      return findRoom
    } catch (error) {
      console.log('🚀 ~ RoomService ~ checkRoom ~ error:', error)
      return null
    }
  }
  async checkRoomWithGuide(userId: string, receiverId: string) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId })
      if (!user) return null

      const receiver = await this.userRepo.findOneBy({ id: receiverId })
      if (!receiver) return null

      const findRoom = await this.roomrepo.findOne({
        where: [
          { user: { id: userId }, travel: { id: receiverId } },
          { travel: { id: receiverId }, user: { id: userId } },
        ],
      })
      if (!findRoom) {
        return null
      }
      return findRoom
    } catch (error) {
      console.log('🚀 ~ RoomService ~ checkRoom ~ error:', error)
      return null
    }
  }
}