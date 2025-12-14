import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { createServer } from 'vite';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'nikhil-sweet-shop'
};