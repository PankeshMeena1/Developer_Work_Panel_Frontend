import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';

const FilterBar = ({ filters, onFiltersChange }) => {
  const availableTags = [
    'code', 'meeting', 'blocker', 'review', 'planning', 
    'testing', 'deployment', 'research', 'documentation'
  ];

  const handleFilterChange = (name, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      tag: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card className="filter-section mb-4">
      <Card.Body>
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Label>Tag</Form.Label>
              <Form.Select
                value={filters.tag}
                onChange={(e) => handleFilterChange('tag', e.target.value)}
              >
                <option value="">All Tags</option>
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            {hasActiveFilters && (
              <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                <i className="fas fa-times me-2"></i>
                Clear
              </Button>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FilterBar;
