import { ItemModel } from '../models/item.model.js';

export const getItems = (req, res) => {
  const items = ItemModel.findAll();
  res.json(items);
};

export const createItem = (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'O nome do item é obrigatório.' });
  }
  const newItem = ItemModel.create(name);
  res.status(201).json(newItem);
};

export const deleteItem = (req, res) => {
  const { id } = req.params;
  ItemModel.delete(id);
  res.status(204).send();
};