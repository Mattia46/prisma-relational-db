import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'hello' });
});

app.get('/products', async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: {
      reviews: true
    }
  });
  res.json(products);
});

app.post('/products', async (req: Request, res: Response) => {
  const { body } = req;
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price
    }
  });
  res.json(product);
});

app.post('/reviews', async (req: Request, res: Response) => {
  const { body } = req;
  const review = await prisma.product.create({
    data: {
      text: body.text,
      rating: body.rating,
      product: {
        connect: {
          id: body.productId
        }
      }
    }
  });
  res.json(review);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);

//curl -X POST localhost:3001/reviews -H "Content-Type: application/json" -d '{"text": "torta", "rating": 11, "productId":"ckttum0130000799eexos1y1d" }'
