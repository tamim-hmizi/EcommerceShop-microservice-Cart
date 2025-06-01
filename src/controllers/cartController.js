import Cart from '../models/Cart.js';

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product, quantity, name, price, image } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === product);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product, quantity, name, price, image });
      }
    } else {
      cart = new Cart({
        user: req.user.id,
        items: [{ product, quantity, name, price, image }],
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === product);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.json(cart);
      } else {
        res.status(404).json({ message: 'Item not found in cart' });
      }
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { product } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      cart.items = cart.items.filter((item) => item.product.toString() !== product);
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getCart, addToCart, updateCartItem, removeCartItem };
