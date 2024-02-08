import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface Users {
  name: string;
  socket: Socket;
}

export class UserManager {
  private users: Users[];
  private queue: string[];
  private roomManager:RoomManager;
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager=new RoomManager();
  }

  addUser(name: string, socket: Socket) {
    this.users.push({ name, socket });
    this.queue.push(socket.id);
    this.matchUsers(socket);//clearQueue
  }

  removeUser(socketId: string) {
    this.users.filter((x) => x.socket.id === socketId);
  }

  //function to match 2 users
  matchUsers(socket:Socket) {
    if (this.users.length < 2) {
      return;
    }
    const user1 = this.users.find((x) => x.socket.id === this.queue.pop());
    const user2 = this.users.find((x) => x.socket.id === this.queue.pop());

    if(!user1 || !user2){
        return
    }
    
    this.roomManager.createRoom(user1,user2);
    this.sdpExchange(socket);
  }

  sdpExchange(socket:Socket){
    socket.on("offer", ({sdp, roomId}: {sdp: string, roomId: string}) => {
        this.roomManager.onOffer(roomId, sdp);
    })

    socket.on('answer',({sdp,roomId}:{sdp: string, roomId: string})=>{
        this.roomManager.onAnswer(roomId,sdp)
    })
  }
}
