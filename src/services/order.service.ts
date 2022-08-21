import {prisma} from "../../prisma/prisma-client";
import {UserOrder} from "prisma/prisma-client";
import {Order, OrderedDishes} from "../models/order.interface";

/**
 * Gets an array of all orders
 * @returns Order[] a list of all Orders.
 */
export const getAllOrders = async (): Promise<Order[]> => {
  const userOrders = await prisma.userOrder.findMany({});
  return userOrders;
};

/**
 * Method for creating order
 * @returns new Order
 */
export const createOrder = async (newOrder: Order): Promise<Order> => {

  let orderDate = new Date(newOrder.order_date);
  // Due to the time zone difference, we add 3 hours to the date for proper storage in the database
  orderDate.setHours(orderDate.getHours() + 3);
  const create_order = await prisma.userOrder.create({
    data: {
      user: {
        connect: { id: newOrder.userId },
      },
      dish: {
        connect: { id: newOrder.dishId },
      },
      amount: newOrder.amount,
      order_date: new Date(orderDate.getDate()),
      price: newOrder.price,
    },
  });
  /*
      Dates in createdAt and updatedAt are created automatically
      using @default(now()) and @updatedAt with GMT time zone.
      Therefore, you must first create an object in the database,
      fill it with values from the body, and then update
      this object by id by changing the createdAt and updatedAt
      fields to the appropriate time zone (in our case GMT+3).
   */
  create_order.createdAt.setHours(create_order.createdAt.getHours() + 3);
  create_order.updatedAt = create_order.createdAt;
  const updated_order = await prisma.userOrder.update({
    where: {
      id: create_order.id,
    },
    data: {
      createdAt: create_order.createdAt,
      updatedAt: create_order.updatedAt,
    }
  })
  return updated_order;
};

/**
 * Displays a list of all orders of a specific user by id
 * @param id
 * @returns Order
 */
export const getUserOrders = async (id: number): Promise<Order[]> => {

  try {
    const toGet: UserOrder[] = await prisma.userOrder.findMany({
      where: {
        userId: id,
      },
      include: {
        user: {
          select: {
            name: true,
            surname: true,
          },
        },
        dish: {
          select: {
            name: true,
            menu_type: true,
          },
        },
      },
    });
    return toGet;
  } catch (e) {
    console.log("getUserOrders \n" + e);
    return null;
  }
};

/**
 * Displays one order of a specific user
 * @param id
 * @returns Order
 */
export const getUserOrder = async (id: number): Promise<Order> => {

  try {
    const toGet: UserOrder = await prisma.userOrder.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            name: true,
            surname: true,
          },
        },
        dish: {
          select: {
            name: true,
            menu_type: true,
          },
        },
      },
    });
    return toGet;
  } catch (e) {
    console.log("getUserOrder \n" + e);
    return null;
  }
};

/**
 * Updates the order fields
 * @param id, update
 * @returns Order
 */
export const updateOrder = async (id: number, update: UserOrder): Promise<Order> => {

  const date = new Date(update.order_date);
  const iso = date.toISOString();
  const updatedOrder = await prisma.userOrder.update({
    where: {
      id: id,
    },
    data: {
      dishId: update.dishId,
      userId: update.userId,
      order_date: iso,
      amount: update.amount,
      price: update.price,
    },
  });
  return updatedOrder;
};

/**
 * Deletes a specific order
 * @param id
 * @returns Order
 */
export const deleteOrder = async (id: number): Promise<Order> => {
  try {
    const deletedOrder = await prisma.userOrder.delete({
      where: {
        id: id
      }
    });
    return deletedOrder;
  } catch (e) {
    console.log("deleteOrder \n" + e);
    return null;
  }
};

/**
 * Displays all orders for a certain period
 * @param dateFrom, dateTo
 * @returns Order[]
 */
export const getOrdersByDate = async (dateFrom: Date, dateTo: Date): Promise<Order[]> => {

  if (!dateFrom || !dateTo) {
    throw new Error("Invalid Date")
  }
  if (dateTo < dateFrom) {
    throw new Error("Invalid range of Date")
  }
  const order = await prisma.userOrder.findMany({
    where: {
      order_date: {
        gte: dateFrom,
        lt: dateTo
      }
    },
    include: {
      user: {
        select: {
          name: true,
          surname: true,
        },
      },
      dish: {
        select: {
          name: true,
          menu_type: true,
        },
      },
    },
  })
  return order
};

/**
 * Create a list of orders
 * @param userId, order_date, orders
 * @returns Order[]
 */
export const createOrders = async (userId: number, order_date: Date, orders: OrderedDishes[]): Promise<Order[]> => {

  let orderDate = new Date(order_date);
  let newOrders: Order[] = [];
  let createdOrders: Order[] = [];
  for (let i = 0; i < orders.length; i++) {
    newOrders.push({
      id: i,
      dishId: orders[i].dishId,
      userId: userId,
      createdAt: orderDate,
      updatedAt: orderDate,
      order_date: orderDate,
      price: orders[i].dishPrice,
      amount: orders[i].Quantity
    });
  }
  /*
      To create an order model in the createdOrders array, you need
      to fill in all the fields of this model. However, in the future,
      we create database entries based on this array, which do not need
      to know about the id, created At and updated At attributes, since
      these attributes are generated automatically. id - auto-initialized,
      createdAt - we set the time of record creation, and updatedat - the time
      of the last update of the record. Therefore, before creating records in the database,
      it is necessary to get rid of unnecessary attributes.
   */
  for (let i = 0; i < orders.length; i++) {
    delete newOrders[i]['id'];
    delete newOrders[i]['createdAt'];
    delete newOrders[i]['updatedAt'];
  }
  for (let i = 0; i < newOrders.length; i++) {
    await createOrder(newOrders[i]);
  }
  return newOrders;
};

/**
 * Getting all user orders for a given period
 * @param dateFrom, dateTo, userId
 * @returns Order[]
 */
export const getUserOrdersByDate = async (dateFrom: Date, dateTo: Date, userId: number): Promise<Order[]> => {

  if (!dateFrom || !dateTo) {
    throw new Error("Invalid Date")
  }
  if (dateTo < dateFrom) {
    throw new Error("Invalid range of Date")
  }
  const orders = await prisma.userOrder.findMany({
    where: {
      order_date: {
        gte: dateFrom,
        lt: dateTo,
      },
      userId: userId
    },
    include: {
      dish: {
        select: {
          id: true,
          menu_type: true,
          name: true,
          category: true,
          price: true,
        },
      },
    },
  })
  return orders
};

/**
 * Delete all user orders for a given date and userId
 * @param userId, order_date
 * @returns count - number of deleted values
 */
export const deleteOrderIdDate = async (userId: number, order_date: Date): Promise<any> => {
  try {
    const count = await prisma.userOrder.deleteMany({
      where: {
        userId: userId,
        order_date: {
          in: order_date
        },
      },
    });
    console.log(count);
    return count;
  } catch (e) {
    console.log("deleteOrderIdDate \n" + e);
    return null;
  }
};

/**
 * Update user order for a given date and userId
 * @param userId, order_date, update
 * @returns count - number of updated values
 */
export const updateOrderIdDate = async (userId: number, order_date: Date, update: UserOrder): Promise<any> => {

  const date = new Date(order_date);
  const iso = date.toISOString();
  const count = await prisma.userOrder.updateMany({
    where: {
      userId: userId,
    },
    data: {
      dishId: update.dishId,
      userId: update.userId,
      order_date: iso,
      amount: update.amount,
      price: update.price,
    },
  });
  return count;
};