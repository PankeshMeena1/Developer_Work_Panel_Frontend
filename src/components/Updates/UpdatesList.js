import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Badge, Modal, Alert } from 'react-bootstrap';
import api from '../../services/api';
import UpdateForm from './UpdateForm';
import FilterBar from './FilterBar';
import { toast } from 'react-toastify';
import moment from 'moment';
import jsPDF from 'jspdf';

const UpdatesList = ({ updates: propUpdates, showActions = true }) => {
  const [updates, setUpdates] = useState(propUpdates || []);
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [loading, setLoading] = useState(!propUpdates);
  const [showForm, setShowForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateToDelete, setUpdateToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    tag: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    if (!propUpdates) {
      fetchUpdates();
    }
  }, [propUpdates]);

  useEffect(() => {
    applyFilters();
  }, [updates, filters]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/updates');
      setUpdates(response.data.updates);
    } catch (error) {
      toast.error('Error fetching updates');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = updates;

    if (filters.search) {
      filtered = filtered.filter(update =>
        update.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        update.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.tag) {
      filtered = filtered.filter(update =>
        update.tags.includes(filters.tag)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(update =>
        moment(update.date).isSameOrAfter(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(update =>
        moment(update.date).isSameOrBefore(filters.dateTo)
      );
    }

    setFilteredUpdates(filtered);
  };

  const handleEdit = (update) => {
    setEditingUpdate(update);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/updates/${id}`);
      setUpdates(updates.filter(update => update._id !== id));
      toast.success('Update deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Error deleting update');
    }
  };

  const confirmDelete = (update) => {
    setUpdateToDelete(update);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = (newUpdate) => {
    if (editingUpdate) {
      setUpdates(updates.map(update =>
        update._id === editingUpdate._id ? newUpdate : update
      ));
      toast.success('Update modified successfully');
    } else {
      setUpdates([newUpdate, ...updates]);
      toast.success('Update created successfully');
    }
    setShowForm(false);
    setEditingUpdate(null);
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 20;

    pdf.setFontSize(20);
    pdf.text('Work Updates Report', 20, yPosition);
    yPosition += 20;

    pdf.setFontSize(12);
    pdf.text(`Generated on: ${moment().format('MMMM DD, YYYY')}`, 20, yPosition);
    yPosition += 20;

    filteredUpdates.forEach((update, index) => {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.text(`${index + 1}. ${update.title}`, 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.text(`Date: ${moment(update.date).format('MMM DD, YYYY')}`, 20, yPosition);
      yPosition += 8;

      if (update.tags.length > 0) {
        pdf.text(`Tags: ${update.tags.join(', ')}`, 20, yPosition);
        yPosition += 8;
      }

      const description = pdf.splitTextToSize(update.description, 170);
      pdf.text(description, 20, yPosition);
      yPosition += description.length * 5 + 10;
    });

    pdf.save(`work-updates-${moment().format('YYYY-MM-DD')}.pdf`);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredUpdates, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `work-updates-${moment().format('YYYY-MM-DD')}.json`;
    link.click();
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
      research: 'bg-warning text-dark'
    };
    return tagClasses[tag] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showActions && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Work Updates</h1>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={exportToJSON}>
                <i className="fas fa-download me-2"></i>
                Export JSON
              </Button>
              <Button variant="outline-primary" onClick={exportToPDF}>
                <i className="fas fa-file-pdf me-2"></i>
                Export PDF
              </Button>
              <Button className="btn-custom" onClick={() => setShowForm(true)}>
                <i className="fas fa-plus me-2"></i>
                Add Update
              </Button>
            </div>
          </div>

          <FilterBar filters={filters} onFiltersChange={setFilters} />
        </>
      )}

      {filteredUpdates.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <i className="fas fa-clipboard-list fa-4x text-muted mb-4"></i>
            <h4 className="text-muted mb-3">No updates found</h4>
            <p className="text-muted mb-4">
              {updates.length === 0
                ? "You haven't created any work updates yet."
                : "No updates match your current filters."}
            </p>
            {showActions && (
              <Button className="btn-custom" onClick={() => setShowForm(true)}>
                <i className="fas fa-plus me-2"></i>
                Create Your First Update
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {filteredUpdates.map((update) => (
            <Col key={update._id} lg={6} xl={4}>
              <Card className="update-card h-100 border-0 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0 flex-grow-1">{update.title}</h5>
                    {showActions && (
                      <div className="d-flex gap-1">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-1 text-primary"
                          onClick={() => handleEdit(update)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-1 text-danger"
                          onClick={() => confirmDelete(update)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="card-text text-muted mb-3 flex-grow-1">
                    {update.description.length > 150
                      ? `${update.description.substring(0, 150)}...`
                      : update.description}
                  </p>

                  <div className="mb-3">
                    {update.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className={`me-1 mb-1 ${getTagClass(tag)}`}
                        pill
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center text-muted small">
                    <span>
                      <i className="fas fa-calendar me-1"></i>
                      {moment(update.date).format('MMM DD, YYYY')}
                    </span>
                    <span>
                      <i className="fas fa-clock me-1"></i>
                      {update.time}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Update Form Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUpdate ? 'Edit Update' : 'Add New Update'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateForm
            update={editingUpdate}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingUpdate(null);
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Are you sure you want to delete this update? This action cannot be undone.
          </Alert>
          {updateToDelete && (
            <div>
              <strong>{updateToDelete.title}</strong>
              <p className="text-muted mt-2">{updateToDelete.description}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(updateToDelete._id)}
          >
            <i className="fas fa-trash me-2"></i>
            Delete Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UpdatesList;