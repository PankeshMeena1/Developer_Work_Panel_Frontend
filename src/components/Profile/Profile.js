import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tabs,
  Tab,
  Image
} from 'react-bootstrap';
import '../../assests/css/Profile.css';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    profileImage: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const profileData = new FormData();
      profileData.append('name', formData.name);
      profileData.append('email', formData.email);
      profileData.append('address', formData.address);
      if (formData.profileImage) {
        profileData.append('profileImage', formData.profileImage);
      }

      await api.put('/auth/profile', profileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      toast.success('Password changed successfully');

      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h2 className="mb-4 text-center">Account Settings</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4 justify-content-center"
            fill
          >
            <Tab eventKey="profile" title="Profile Info">
              <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                  <Form onSubmit={handleProfileUpdate}>
                    <Form.Group className="mb-3 text-center">
                      {formData.profileImage ? (
                        <Image
                          src={URL.createObjectURL(formData.profileImage)}
                          roundedCircle
                          height={100}
                          width={100}
                          className="object-fit-cover"
                        />
                      ) : (
                        <div className="mb-2">No Profile Image</div>
                      )}
                      <Form.Control
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Address (Optional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      className="btn btn-custom w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="password" title="Change Password">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Form onSubmit={handlePasswordChange}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      className="btn btn-custom w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Changing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-key me-2" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
