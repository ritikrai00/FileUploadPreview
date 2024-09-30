import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const manipulateImage = async (imageFile) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(URL.createObjectURL(imageFile));
    }, 2000);
  });
};

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    if (username === 'user' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  return { isLoggedIn, username, setUsername, password, setPassword, login, logout };
};

const FileUploadPreview = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [manipulatedImage, setManipulatedImage] = useState(null);
  const { isLoggedIn, username, setUsername, password, setPassword, login, logout } = useAuth();

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setFileType(null);
      return;
    }

    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileType(selectedFile.type);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);

    if (fileType.startsWith('image/')) {
      const manipulated = await manipulateImage(file);
      setManipulatedImage(manipulated);
    }
  };

  const renderPreview = () => {
    if (!preview) return null;

    if (fileType.startsWith('image/')) {
      return <img src={preview} alt="Preview" className="img-fluid" />;
    } else if (fileType.startsWith('audio/')) {
      return <audio controls src={preview} className="w-100" />;
    } else if (fileType.startsWith('video/')) {
      return <video controls src={preview} className="img-fluid" />;
    } else if (fileType === 'application/pdf') {
      return (
        <object
          data={preview}
          type="application/pdf"
          width="100%"
          height="500px"
        >
          <p>Unable to display PDF file. <a href={preview}>Download</a> instead.</p>
        </object>
      );
    }
    return <p>Preview not available for this file type.</p>;
  };

  if (!isLoggedIn) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Header>
                <Card.Title>Login</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Username=user"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Password=password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" className="w-100" onClick={login}>Login</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0">File Upload and Preview</Card.Title>
          <Button variant="outline-secondary" onClick={logout}>Logout</Button>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Control type="file" onChange={handleFileChange} accept="image/*,audio/*,video/*,.pdf" />
          </Form.Group>
          <Button 
            variant="primary" 
            className="w-100" 
            onClick={handleUpload} 
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Uploading...
              </>
            ) : (
              <>
                <i className="bi bi-upload me-2"></i>
                Upload
              </>
            )}
          </Button>
        </Card.Body>
      </Card>

      {file && (
        <Card className="mb-4">
          <Card.Header>
            <Card.Title>
              <i className="bi bi-eye me-2"></i>
              File Preview
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {renderPreview()}
          </Card.Body>
        </Card>
      )}

      {fileType && (
        <Alert variant="info">
          <Alert.Heading>
            <i className="bi bi-info-circle me-2"></i>
            File Type Detected
          </Alert.Heading>
          <p className="mb-0">{fileType}</p>
        </Alert>
      )}

      {manipulatedImage && (
        <Card className="mt-4">
          <Card.Header>
            <Card.Title>Manipulated Image</Card.Title>
          </Card.Header>
          <Card.Body>
            <img src={manipulatedImage} alt="Manipulated" className="img-fluid" />
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default FileUploadPreview;