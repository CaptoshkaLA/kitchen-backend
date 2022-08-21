export interface Order {
  id: number,
  dishId: number,
  userId: number,
  createdAt: Date,
  updatedAt: Date,
  order_date: Date,
  amount: number,
  price: number,
}

/*
    This interface is designed for the convenience of
    reading data from a POST request to create user orders
 */
export interface OrderedDishes {
  dishId: number,
  dishTypeName: string,
  orderedDishName: string,
  dishPrice: number,
  Quantity: number,
}