import { useState, useEffect } from 'react';
import './Tables.css';

interface RestaurantTable {
  id: number;
  table_number: number;
  capacity: number;
  is_occupied: boolean;
}

// Mock data - will be replaced with API calls when backend is set up
const MOCK_TABLES: RestaurantTable[] = [
  { id: 1, table_number: 1, capacity: 2, is_occupied: false },
  { id: 2, table_number: 2, capacity: 2, is_occupied: true },
  { id: 3, table_number: 3, capacity: 4, is_occupied: false },
  { id: 4, table_number: 4, capacity: 4, is_occupied: false },
  { id: 5, table_number: 5, capacity: 6, is_occupied: true },
  { id: 6, table_number: 6, capacity: 6, is_occupied: false },
  { id: 7, table_number: 7, capacity: 4, is_occupied: false },
  { id: 8, table_number: 8, capacity: 8, is_occupied: true },
  { id: 9, table_number: 9, capacity: 2, is_occupied: false },
  { id: 10, table_number: 10, capacity: 4, is_occupied: false },
];

export default function Tables() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newCapacity, setNewCapacity] = useState('4');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTables(MOCK_TABLES);
      setLoading(false);
    }, 500);
  }, []);

  function addTable(e: React.FormEvent) {
    e.preventDefault();
    const tableNum = parseInt(newTableNumber, 10);
    const capacity = parseInt(newCapacity, 10);
    
    if (isNaN(tableNum) || tableNum < 1) {
      setMessage({ type: 'error', text: 'Please enter a valid table number' });
      return;
    }
    
    if (tables.some(t => t.table_number === tableNum)) {
      setMessage({ type: 'error', text: 'Table number already exists' });
      return;
    }

    const newTable: RestaurantTable = {
      id: Date.now(),
      table_number: tableNum,
      capacity: capacity || 4,
      is_occupied: false,
    };

    setTables(prev => [...prev, newTable].sort((a, b) => a.table_number - b.table_number));
    setNewTableNumber('');
    setNewCapacity('4');
    setShowAddForm(false);
    setMessage({ type: 'success', text: `Table ${tableNum} added successfully!` });
    
    setTimeout(() => setMessage(null), 3000);
  }

  function deleteTable(id: number) {
    const table = tables.find(t => t.id === id);
    if (table?.is_occupied) {
      setMessage({ type: 'error', text: 'Cannot delete an occupied table' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setTables(prev => prev.filter(t => t.id !== id));
    setMessage({ type: 'success', text: 'Table deleted successfully' });
    setTimeout(() => setMessage(null), 3000);
  }

  function toggleOccupied(id: number) {
    setTables(prev => prev.map(t => 
      t.id === id ? { ...t, is_occupied: !t.is_occupied } : t
    ));
  }

  if (loading) {
    return (
      <div className="tables-page">
        <div className="tables-header">
          <h1>🪑 Table Management</h1>
          <p className="tables-subtitle">Loading tables...</p>
        </div>
        <div className="tables-loading">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  const occupiedCount = tables.filter(t => t.is_occupied).length;
  const availableCount = tables.length - occupiedCount;

  return (
    <div className="tables-page">
      {/* Header */}
      <div className="tables-header">
        <div>
          <h1>🪑 Table Management</h1>
          <p className="tables-subtitle">Manage restaurant tables and track occupancy</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary btn-lg"
          onClick={() => setShowAddForm(true)}
        >
          <span>+</span> Add Table
        </button>
      </div>

      {/* Stats */}
      <div className="tables-stats">
        <div className="table-stat-card total">
          <span className="stat-icon">🪑</span>
          <div className="stat-info">
            <span className="stat-value">{tables.length}</span>
            <span className="stat-label">Total Tables</span>
          </div>
        </div>
        <div className="table-stat-card available">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-value">{availableCount}</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
        <div className="table-stat-card occupied">
          <span className="stat-icon">🔴</span>
          <div className="stat-info">
            <span className="stat-value">{occupiedCount}</span>
            <span className="stat-label">Occupied</span>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? '✓' : '✕'} {message.text}
        </div>
      )}

      {/* Tables Grid */}
      <div className="tables-grid">
        {tables.map((table) => (
          <div 
            key={table.id} 
            className={`table-card ${table.is_occupied ? 'occupied' : 'available'}`}
          >
            <div className="table-card-header">
              <span className="table-number">Table {table.table_number}</span>
              <span className={`table-status ${table.is_occupied ? 'occupied' : 'available'}`}>
                {table.is_occupied ? 'Occupied' : 'Available'}
              </span>
            </div>
            <div className="table-card-body">
              <div className="table-icon">🪑</div>
              <div className="table-capacity">
                <span className="capacity-value">{table.capacity}</span>
                <span className="capacity-label">seats</span>
              </div>
            </div>
            <div className="table-card-actions">
              <button
                type="button"
                className={`btn btn-sm ${table.is_occupied ? 'btn-accent' : 'btn-secondary'}`}
                onClick={() => toggleOccupied(table.id)}
              >
                {table.is_occupied ? 'Mark Available' : 'Mark Occupied'}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => deleteTable(table.id)}
                disabled={table.is_occupied}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      {showAddForm && (
        <>
          <div className="modal-backdrop" onClick={() => setShowAddForm(false)} />
          <div className="add-table-modal">
            <div className="modal-header">
              <h3>Add New Table</h3>
              <button 
                type="button" 
                className="modal-close"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={addTable}>
              <div className="modal-body">
                <div className="input-group">
                  <label>Table Number</label>
                  <input
                    type="number"
                    min={1}
                    value={newTableNumber}
                    onChange={(e) => setNewTableNumber(e.target.value)}
                    placeholder="e.g. 11"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Capacity (seats)</label>
                  <select
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    required
                  >
                    <option value="2">2 seats</option>
                    <option value="4">4 seats</option>
                    <option value="6">6 seats</option>
                    <option value="8">8 seats</option>
                    <option value="10">10 seats</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
