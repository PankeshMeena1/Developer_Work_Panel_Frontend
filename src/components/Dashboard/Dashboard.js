import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import api from '../../services/api';
import UpdatesList from '../Updates/UpdatesList';
import moment from 'moment';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUpdates: 0,
    todayUpdates: 0,
    weekUpdates: 0,
    monthUpdates: 0
  });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, updatesResponse] = await Promise.all([
        api.get('/updates/stats'),
        api.get('/updates?limit=5')
      ]);

      setStats(statsResponse.data);
      setRecentUpdates(updatesResponse.data.updates);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, gradient }) => (
    <Card className={`h-100 border-0 ${gradient}`}>
      <Card.Body className="text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="card-title text-white-50 mb-2">{title}</h6>
            <h2 className="mb-0 fw-bold">{value}</h2>
          </div>
          <div className="opacity-75">
            <i className={`${icon} fa-2x`}></i>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Dashboard</h1>
        <small className="text-muted">
          Welcome back! Here's what's happening with your work updates.
        </small>
      </div>

      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <StatCard
            title="Total Updates"
            value={stats.totalUpdates}
            icon="fas fa-clipboard-list"
            gradient="stats-card"
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            title="Today"
            value={stats.todayUpdates}
            icon="fas fa-calendar-day"
            gradient="bg-success"
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            title="This Week"
            value={stats.weekUpdates}
            icon="fas fa-calendar-week"
            gradient="bg-warning"
          />
        </Col>
        <Col lg={3} md={6}>
          <StatCard
            title="This Month"
            value={stats.monthUpdates}
            icon="fas fa-calendar-alt"
            gradient="bg-info"
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Recent Updates</h5>
            </Card.Header>
            <Card.Body>
              {recentUpdates.length > 0 ? (
                <UpdatesList updates={recentUpdates} showActions={false} />
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No updates yet</h5>
                  <p className="text-muted">Start by creating your first work update!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
