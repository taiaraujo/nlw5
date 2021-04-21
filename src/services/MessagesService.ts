import { getCustomRepository, Repository } from "typeorm";
import { Message } from "../entities/Message";
import { User } from "../entities/User";
import { MessagesRepository } from "../repositories/MessagesRepository";
import { UsersRepository } from "../repositories/UsersRepository";

interface IMessageCreate {
  admin_id ? : string;
  text: string;
  user_id: string;
}


class MessagesService {

  private messagesRepository: Repository<Message>;
  private usersRepository: Repository<User>;

  constructor(){
    this.messagesRepository = getCustomRepository(MessagesRepository);
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  async create({ admin_id, text, user_id }: IMessageCreate){
    const userAlreadyExists = await this.usersRepository.findOne({ 
      id: user_id 
    });

    if(!userAlreadyExists){
      throw new Error ("User not found!")
    }

    const message = this.messagesRepository.create({
      admin_id,
      text,
      user_id
    })

    await this.messagesRepository.save(message)
    return message;
  }

  async listByUser(user_id: string){    
    const list= await this.messagesRepository.find({
      where: {user_id},
      relations: ["user"]
    })

    return list;
  }
}

export { MessagesService }