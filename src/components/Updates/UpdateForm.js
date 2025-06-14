import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Badge } from 'react-bootstrap';
import api from '../../services/api';
import moment from 'moment';

const UpdateForm = ({ update, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm'),
    tags: []
  });
  const [loading, setLoading] = useState(false);

  const availableTags = [
    'code', 'meeting', 'blocker', 'review', 'planning', 
    'testing', 'deployment', 'research', 'documentation'
  ];

  useEffect(() => {
    if (update) {
      setFormData({
        title: update.title,
        description: update.description,
        date: moment(update.date).format('YYYY-MM-DD'),
        time: update.time,
        tags: update.tags || []
      });
    }
  }, [update]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (update) {
        response = await api.put(`/updates/${update._id}`, formData);
      } else {
        response = await api.post('/updates', formData);
      }
      
      onSubmit(response.data);
    } catch (error) {
      console.error('Error saving update:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTagClass = (tag) => {
    const tagClasses = {
      code: 'bg-primary',
      meeting: 'bg-warning text-dark',
      blocker: 'bg-danger',
      review: 'bg-success',
      planning: 'bg-info',
      testing: 'bg-secondary',
      deployment: 'bg-success',
      research: 'bg-warning text-dark',
      documentation: 'bg-info'
    };
    return tagClasses[tag] || 'bg-secondary';
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Title <span className="text-danger">*</span></Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter update title"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description <span className="text-danger">*</span></Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe what you worked on..."
        />
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Tags</Form.Label>
        <div className="mt-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              className={`me-2 mb-2 p-2 cursor-pointer ${
                formData.tags.includes(tag)
                  ? getTagClass(tag)
                  : 'bg-light text-dark border'
              }`}
              style={{ cursor: 'pointer', fontSize: '0.875rem' }}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
              {formData.tags.includes(tag) && (
                <i className="fas fa-check ms-1"></i>
              )}
            </Badge>
          ))}
        </div>
        <Form.Text className="text-muted">
          Click on tags to select/deselect them
        </Form.Text>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" className="btn-custom" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              {update ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <i className={`fas ${update ? 'fa-save' : 'fa-plus'} me-2`}></i>
              {update ? 'Update' : 'Create'} Update
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default UpdateForm;