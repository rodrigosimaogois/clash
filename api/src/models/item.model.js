// Simulação de banco em memória
let items = [
  { id: 1, name: 'Estudar Angular' },
  { id: 2, name: 'Criar API Node.js' }
];

export const ItemModel = {
  findAll: () => items,

  create: (name) => {
    const newItem = { id: Date.now(), name };
    items.push(newItem);
    return newItem;
  },

  delete: (id) => {
    const numericId = Number(id);
    items = items.filter(item => item.id !== numericId);
    return true;
  }
};