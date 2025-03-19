import { Column, JoinColumn, ManyToOne, Entity } from 'typeorm';
import Base from '../../entities/base.entity';
import { User } from '../../entities/user/user.entity';
import { Room } from './room.entity';
import { Travel } from '../../entities/travels/travel.entity';
import { Guide } from '../../entities/guide/guide.entity';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity('chat')
export class Chat extends Base {
  @Field()
  @Column({ name: 'message' })
  message: string;

  @Field()
  @Column({ default: false })
  read: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.sendMessage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_user_id' })
  senderUser: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.sendMessage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_user_id' })
  receiverUser: User;

  @Field(() => Travel, { nullable: true })
  @ManyToOne(() => Travel, (travel) => travel.receiveMessage, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'receiver_travel_id' })
  receiverTravel: Travel;

  @Field(() => Travel, { nullable: true })
  @ManyToOne(() => Travel, (travel) => travel.sendMessage, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'sender_travel_id' })
  senderTravel: Travel;

  @Field(() => Guide, { nullable: true })
  @ManyToOne(() => Guide, (guide) => guide.sendMessage, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'sender_guide_id' })
  senderGuide: Guide;

  @Field(() => Guide, { nullable: true })
  @ManyToOne(() => Guide, (guide) => guide.receiveMessage, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'receiver_guide_id' })
  receiverGuide: Guide;

  @Field(() => Room)
  @ManyToOne(() => Room, (room) => room.chat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;
}

