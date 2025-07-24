import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { styles } from '../assets/dummyadmin';

const List = () => {
  const [items, setItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/items');
        setItems(data);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
      setSuccessMessage('Item deleted successfully');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  return (
    <div className={styles.pageWrapper}>
      <div className="max-w-7xl mx-auto">
        <div className={styles.cardContainer}>
          <h2 className={styles.title}>Manage Menu Items</h2>

          {successMessage && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">
              {successMessage}
            </div>
          )}

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Image</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Price (₹)</th>
                  <th className={styles.th}>Rating</th>
                  <th className={styles.th}>Hearts</th>
                  <th className={styles.thCenter}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className={styles.tr}>
                    <td className={styles.imgCell}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={styles.img}
                      />
                    </td>
                    <td className={styles.nameCell}>
                      <div className="space-y-1">
                        <p className={styles.nameText}>{item.name}</p>
                        <p className={styles.descText}>{item.description}</p>
                      </div>
                    </td>
                    <td className={styles.categoryCell}>{item.category}</td>
                    <td className={styles.priceCell}>₹{item.price}</td>
                    <td className={styles.ratingCell}>
                      <div className="flex gap-1">{renderStars(item.rating)}</div>
                    </td>
                    <td className={styles.heartsCell}>
                      <div className={styles.heartsWrapper}>
                        <FiHeart className="text-xl" />
                        <span>{item.hearts}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className={styles.deleteBtn}
                      >
                        <FiTrash2 className="text-2xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <div className={styles.emptyState}>No items found in the menu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
