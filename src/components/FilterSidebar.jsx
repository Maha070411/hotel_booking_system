import React from 'react';

const FilterSidebar = ({
    isOpen,
    onClose,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    maxPrice,
    setMaxPrice,
    allAmenities,
    selectedAmenities,
    toggleAmenity,
    clearFilters,
    applyFilters
}) => {
    return (
        <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h3>Filters</h3>
                <button className="close-sidebar" onClick={onClose}>&times;</button>
            </div>

            <div className="sidebar-content">
                {/* Date Section */}
                <div className="sidebar-section">
                    <h4 className="section-title">Stay Dates</h4>
                    <div className="sidebar-date-group">
                        <div className="input-field">
                            <label>Check-in</label>
                            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                        </div>
                        <div className="input-field">
                            <label>Check-out</label>
                            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Price Slider Section */}
                <div className="sidebar-section">
                    <h4 className="section-title">Price Range</h4>
                    <div className="sidebar-price-group">
                        <input
                            type="range"
                            className="sidebar-range"
                            min="0"
                            max="10000"
                            step="100"
                            value={maxPrice || 10000}
                            onChange={e => setMaxPrice(e.target.value)}
                        />
                        <div className="price-label">
                            Up to <span>${maxPrice || '10000+'}</span>
                        </div>
                    </div>
                </div>

                {/* Amenity Section */}
                <div className="sidebar-section">
                    <h4 className="section-title">Amenities</h4>
                    <div className="sidebar-amenity-grid">
                        {allAmenities.length > 0 ? (
                            allAmenities.map(amenity => (
                                <label key={amenity.id} className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.includes(amenity.name)}
                                        onChange={() => toggleAmenity(amenity.name)}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="amenity-name">{amenity.name}</span>
                                </label>
                            ))
                        ) : (
                            <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>No amenities loaded. Check server connection.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="sidebar-footer">
                <button className="reset-link" onClick={clearFilters}>Reset All</button>
                <button className="apply-btn" onClick={() => { applyFilters(); onClose(); }}>Apply</button>
            </div>
        </aside>
    );
};

export default FilterSidebar;
