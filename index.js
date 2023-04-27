const express = require("express");
const uuid = require("uuid");
const port = 3001;
const app = express();
app.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
  const { id } = request.params;

  const index = orders.findIndex((order) => order.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Order not found." });
  }

  request.orderIndex = index;
  request.orderId = id;

  next();
};

app.get("/orders", (request, response) => {
  return response.json(orders);
});

app.post("/orders", (request, response) => {
  const { order, name } = request.body;

  const finalOrder = { id: uuid.v4(), order, name };

  orders.push(finalOrder);

  return response.status(201).json(finalOrder);
});

app.put("/orders/:id", checkOrderId, (request, response) => {
  const { order, name } = request.body;
  const index = request.orderIndex;
  const id = request.orderId;
  const updatedOrder = { id, order, name };

  orders[index] = updatedOrder;

  return response.json(updatedOrder);
});

app.delete("/orders/:id", checkOrderId, (request, response) => {
  const index = request.orderIndex;

  orders.splice(index, 1);

  return response.status(200).json({ message: "Order Deleted" });
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
