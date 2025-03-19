import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Base from '../../entities/base.entity';
import { Chat } from './chat.entity';
import { User } from '../../entities/user/user.entity';
import { Guide } from '../../entities/guide/guide.entity';
import { Travel } from '../../entities/travels/travel.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('room')
export class Room extends Base {
  @Field(() => User) 
  @ManyToOne(() => User, (user) => user.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Guide)
  @ManyToOne(() => Guide, (guide) => guide.guides, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guide_id' })
  guide: Guide;

  @Field(() => Travel)
  @ManyToOne(() => Travel, (travel) => travel.travels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;

  @Field(() => [Chat])
  @OneToMany(() => Chat, (chat) => chat.room, { cascade: true })
  chat: Chat[];
}
