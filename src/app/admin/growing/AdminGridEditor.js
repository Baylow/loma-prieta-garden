'use client'

import { useState } from 'react'
import { updateBedGrid } from '../actions'

export default function AdminGridEditor({ bed }) {
  // Ensure we have a 30-element array (3 rows x 10 cols)
  const initialGrid = Array.isArray(bed.grid_data) && bed.grid_data.length === 30
    ? bed.grid_data 
    : Array(30).fill('');

  const [grid, setGrid] = useState(initialGrid);
  const [selectedCell, setSelectedCell] = useState(null);
  const [plantInput, setPlantInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleCellClick = (index) => {
    setSelectedCell(index);
    setPlantInput(grid[index] || '');
  }

  const handlePlantChange = (e) => {
    setPlantInput(e.target.value);
  }

  const handleApplyPlant = () => {
    if (selectedCell !== null) {
      const newGrid = [...grid];
      newGrid[selectedCell] = plantInput;
      setGrid(newGrid);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const result = await updateBedGrid(bed.id, grid);
    if (result?.error) {
      setError(result.error);
    }
    setSaving(false);
  }

  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: 'var(--primary-purple)' }}>{bed.bed_number}</h4>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn btn-primary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          {saving ? 'Saving...' : 'Save Grid'}
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
        {/* The 10x3 Grid */}
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(10, 1fr)', 
            gridTemplateRows: 'repeat(3, 1fr)', 
            gap: '4px',
            backgroundColor: '#8B5A2B', // wood color for the bed frame
            padding: '8px',
            borderRadius: '4px',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
          }}>
            {grid.map((cell, index) => (
              <div 
                key={index}
                onClick={() => handleCellClick(index)}
                style={{
                  aspectRatio: '1',
                  backgroundColor: selectedCell === index ? 'rgba(255,255,255,0.8)' : (cell ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.2)'),
                  border: selectedCell === index ? '2px solid var(--teal)' : '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  padding: '2px',
                  overflow: 'hidden',
                  wordBreak: 'break-word',
                  color: selectedCell === index ? '#000' : '#fff',
                  transition: 'all 0.2s'
                }}
              >
                {cell || '+'}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Sidebar */}
        <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '4px' }}>
          {selectedCell === null ? (
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Click a square in the grid to edit what's growing there.</p>
          ) : (
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                Editing Cell {selectedCell + 1}
              </label>
              <input 
                type="text" 
                value={plantInput}
                onChange={handlePlantChange}
                placeholder="e.g. Tomatoes"
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <button 
                onClick={handleApplyPlant}
                className="btn btn-secondary" 
                style={{ padding: '0.5rem', fontSize: '0.875rem', marginTop: '0.5rem' }}
              >
                Apply to Cell
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
