import { Kafka } from "kafkajs";
import type { Producer, Admin } from "kafkajs";
import dotenv from "dotenv"

dotenv.config();


let producer: Producer | undefined;
let admin: Admin | undefined;

export const connectKafka = async () => {
    try {
        const kafka = new Kafka({
            clientId: 'auth-service',
            brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
        });


        admin = kafka.admin()
        await admin.connect()
        const topics = await admin.listTopics();
        if (!topics.includes("send-mail"))
           {
             await admin.createTopics({
                topics: [
                    {
                        topic: 'send-mail',
                        numPartitions: 1,
                        replicationFactor: 1
                    }
                ]
            })
        console.log("topics sent");
           }
           await admin.disconnect()
           producer=kafka.producer();
           await producer.connect()
           console.log("connected to kafka prodcuer");
           
    }
    catch (error) {

console.log("failed kafka ",error);

    }
}



export const publishToTopic=async(topic:string,message:any):Promise<boolean>=>{
    try{
        if(!producer){
            console.warn("kafka producer not started, attempting to connect...");
            try{
                await connectKafka();
            }catch(err){
                console.error('Failed to connect producer', err);
            }
            if(!producer){
                console.error("producer not available after connect attempt");
                return false;
            }
        }

        await producer.send({
            topic:topic,
            messages:[
                {
                    value:JSON.stringify(message)
                }
            ]
        })
        return true;
    }
    catch(error){
            console.error("failed to send message", error && (error instanceof Error ? error.message : error));
            // If the producer/client was closed, try to reconnect once and retry
            const errMsg = error && (error instanceof Error ? error.message : String(error));
            if (typeof errMsg === 'string' && errMsg.includes('The client is closed')) {
                console.warn('Producer client closed. Attempting to reconnect...');
                try {
                    await connectKafka();
                    if (!producer) {
                        console.error('Reconnection attempt failed: producer not initialized');
                        return false;
                    }
                    await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });
                    console.log('Message sent after reconnect');
                    return true;
                } catch (reconnectErr) {
                    console.error('Failed to resend message after reconnect', reconnectErr);
                    return false;
                }
            }
            return false;
        
    }
}
export const disconnectKafka=async()=>{
    if(producer){
            try{
                await producer.disconnect();
            }catch(err){
                console.warn('Error while disconnecting producer', err);
            }
            producer = undefined;
    }
}
