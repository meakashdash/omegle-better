import { uuid } from "uuidv4";
import { Users } from "./UserManager";
import { Socket } from "socket.io";
let GLOBAL_ROOM=1;
export interface Room{
    user1:Users,
    user2:Users
}

export class RoomManager{
    private rooms:Map<String,Room>;
    constructor(){
        this.rooms=new Map<string,Room>();
    }

    createRoom(user1:Users,user2:Users){
        const roomId=this.generate();
        this.rooms.set(roomId.toString(),{
            user1,
            user2,
        })

        user1.socket.emit('send-offer',{
            roomId
        })
    }

    onOffer(roomId:string,sdp:string){
        const user2=this.rooms.get(roomId)?.user2;
        user2?.socket.emit('offer',{
            sdp
        })
    }

    onAnswer(roomId:string,sdp:string){
        const user1=this.rooms.get(roomId)?.user1;
        user1?.socket.emit('answer',{
            sdp
        })
    }

    generate(){
        return GLOBAL_ROOM++;
    }
}