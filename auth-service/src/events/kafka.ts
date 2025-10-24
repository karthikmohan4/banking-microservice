import { Kafka, Partitioners } from "kafkajs";
import { config } from "../config";
import logger from "../config/logger";

const kafka = new Kafka({
clientId: config.SERVICE_NAME,
brokers:[config.KAFKA_BROKER]
});

export const producer = kafka.producer({
    allowAutoTopicCreation:true,
    createPartitioner:Partitioners.DefaultPartitioner,
});

export const connectKafka = async ()=>{
    try {
        await producer.connect();
        logger.info('kafka producer connected');
    } catch (error) {
        logger.error('Failed to connect kafka producer/consumer', error);
        throw error;
    }
}

export const disconnectKafka = async ()=>{
    try {
        await producer.disconnect();
        logger.info('Kafka producer disconneccted');
    } catch (error) {
        logger.error('Failed to disconnect kafka producer',error);
    }
}

process.on('SIGTERM',async()=>{
    await producer.disconnect();
});

process.on('SIGINT',async()=>{
    await producer.disconnect();
});