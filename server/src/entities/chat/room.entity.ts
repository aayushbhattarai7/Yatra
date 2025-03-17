
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import Base from '../../entities/base.entity'
import { Chat } from './chat.entity'
import { User } from '../../entities/user/user.entity'
import { Guide } from '../../entities/guide/guide.entity'
import { Travel } from '../../entities/travels/travel.entity'

@Entity('room')
export class Room extends Base {
  @ManyToOne(() => User, (User) => User.users, {
    onDelete: 'CASCADE',

  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Guide, (guide) => guide.guides, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guide_id' })
  guide: Guide
  @ManyToOne(() => Travel, (travel) => travel.travels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'travel_id' })
  travel: Travel

  @OneToMany(() => Chat, (chat) => chat.room, { cascade: true })
  chat: Chat[]
}
