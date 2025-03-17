import { Column, JoinColumn, ManyToOne, Entity, ManyToMany, OneToMany } from 'typeorm'
import Base from '../../entities/base.entity'
import { User } from '../../entities/user/user.entity'
import { Room } from './room.entity'
import { Travel } from '../../entities/travels/travel.entity'
import { Guide } from '../../entities/guide/guide.entity'

@Entity('chat')
export class Chat extends Base {
  @Column({ name: 'message' })
  message: string

  @Column({ default: false })
  read: boolean

  @ManyToOne(() => User, (User) => User.sendMessage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_user_id' })
  senderUser: User
  @ManyToOne(() => User, (User) => User.sendMessage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_user_id' })
  receiverUser: User

  @ManyToOne(() => Travel, (travel) => travel.receiveMessage, {
    onDelete: 'CASCADE',
    nullable:true
  })
  @JoinColumn({ name: 'receiver_travel_id' })
  receiverTravel: Travel
  @ManyToOne(() => Travel, (travel) => travel.sendMessage, {
    onDelete: 'CASCADE',
    nullable:true
  })
  @JoinColumn({ name: 'sender_travel_id' })
  senderTravel: Travel
  @ManyToOne(() => Guide, (guide) => guide.sendMessage, {
    onDelete: 'CASCADE',
    nullable:true
  })
  @JoinColumn({ name: 'sender_guide_id' })
  senderGuide: Guide
  @ManyToOne(() => Guide, (guide) => guide.receiveMessage, {
    onDelete: 'CASCADE',
    nullable:true
  })
  @JoinColumn({ name: 'receiver_guide_id' })
  receiverGuide: Guide

  @ManyToOne(() => Room, (room) => room.chat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: Room
}