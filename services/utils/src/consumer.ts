import { Kafka } from 'kafkajs'
import dotenv from "dotenv"
import nodemailer from "nodemailer"
dotenv.config();
export const startSendMailConsumer = async () => {
    try {
        const kafka = new Kafka({
            clientId: 'my-app',
            brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
        });


        const consumer = kafka.consumer({ groupId: "mail-service-group" })
        await consumer.connect();
        const topicName = "send-mail"
        await consumer.subscribe({ topic: topicName, fromBeginning: false })
        console.log("mail service");

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const { to, subject, html } = JSON.parse(message?.value?.toString() || "{}");

                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user:process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASSWORD
                        }

                    })
                    await transporter.sendMail({
                        from: process.env.EMAIL_FROM || `"Manali Jain" <${process.env.EMAIL_USER}>`,
                        to,
                        subject,
                        html
                    })
                    console.log("mail sent");

                }
                catch(error){
                    console.log("failed to sent mail",error);
                    
                }
    }
        })

    }
    catch (error) {
console.log("failed to start kafka");

    }
}