import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { internshipsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/UI/PageHeader';
import { Card, CardContent } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Spinner from '../components/UI/Spinner';
import Badge from '../components/UI/Badge';

const InternshipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  
  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        setLoading(true);
        const data = await internshipsApi.getListingById(id);
        setInternship(data);
      } catch (err) {
        console.error('Error fetching internship details:', err);
        setError('Дадлагын мэдээллийг ачаалж чадсангүй');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInternshipDetails();
  }, [id]);
  
  const handleApply = async () => {
    if (!isAuthenticated) {
      showToast('Та эхлээд нэвтрэх шаардлагатай', 'warning');
      navigate('/login', { state: { from: `/internships/${id}` } });
      return;
    }
    
    try {
      setApplying(true);
      await internshipsApi.applyToListing(id);
      showToast('Таны өргөдөл амжилттай илгээгдлээ', 'success');
      // Refresh internship data to update application status
      const updatedInternship = await internshipsApi.getListingById(id);
      setInternship(updatedInternship);
    } catch (err) {
      console.error('Error applying to internship:', err);
      showToast(err.message || 'Өргөдөл илгээхэд алдаа гарлаа', 'error');
    } finally {
      setApplying(false);
    }
  };
  
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showToast('Та эхлээд нэвтрэх шаардлагатай', 'warning');
      navigate('/login', { state: { from: `/internships/${id}` } });
      return;
    }
    
    try {
      setBookmarking(true);
      if (internship.is_bookmarked) {
        await internshipsApi.removeBookmark(id);
        showToast('Хадгалсан дадлагаас хасагдлаа', 'success');
      } else {
        await internshipsApi.addBookmark(id);
        showToast('Дадлага хадгалагдлаа', 'success');
      }
      // Refresh internship data to update bookmark status
      const updatedInternship = await internshipsApi.getListingById(id);
      setInternship(updatedInternship);
    } catch (err) {
      console.error('Error bookmarking internship:', err);
      showToast(err.message || 'Хадгалахад алдаа гарлаа', 'error');
    } finally {
      setBookmarking(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-red-600">{error}</h2>
              <Button 
                onClick={() => navigate('/internships')}
                className="mt-4"
              >
                Бүх дадлага руу буцах
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!internship) return null;
  
  const {
    organization,
    position,
    location,
    type,
    duration,
    salary,
    description,
    requirements,
    benefits,
    application_deadline,
    has_applied,
    is_bookmarked,
    status
  } = internship;
  
  const isActive = status === 'active';
  const isDeadlinePassed = new Date(application_deadline) < new Date();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button onClick={() => navigate('/internships')} variant="text">
          ← Бүх дадлага руу буцах
        </Button>
      </div>
      
      <PageHeader 
        title={position} 
        description={`${organization} | ${location}`}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Дадлагын мэдээлэл</h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge color="primary">{type}</Badge>
                <Badge color="secondary">{duration}</Badge>
                {salary && <Badge color="success">{salary}</Badge>}
                <Badge color={isActive ? 'success' : 'error'}>
                  {isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                </Badge>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Тайлбар</h3>
                <p className="whitespace-pre-line">{description}</p>
              </div>
              
              {requirements && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Шаардлагууд</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {requirements.split('\n').map((req, idx) => 
                      req.trim() && <li key={idx}>{req.trim()}</li>
                    )}
                  </ul>
                </div>
              )}
              
              {benefits && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Урамшуулал</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {benefits.split('\n').map((benefit, idx) => 
                      benefit.trim() && <li key={idx}>{benefit.trim()}</li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Үйлдэл</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm mb-1">Өргөдөл хүлээн авах хугацаа:</p>
                  <p className="font-semibold">
                    {new Date(application_deadline).toLocaleDateString('mn-MN')}
                    {isDeadlinePassed && 
                      <span className="text-red-500 ml-2">(Хугацаа дууссан)</span>
                    }
                  </p>
                </div>
                
                <Button
                  onClick={handleApply}
                  className="w-full"
                  variant="primary"
                  loading={applying}
                  disabled={!isActive || isDeadlinePassed || has_applied}
                >
                  {has_applied ? 'Өргөдөл илгээгдсэн' : 'Өргөдөл илгээх'}
                </Button>
                
                <Button
                  onClick={handleBookmark}
                  className="w-full"
                  variant="secondary"
                  loading={bookmarking}
                >
                  {is_bookmarked ? 'Хадгалагдсан' : 'Хадгалах'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Байгууллагын мэдээлэл</h2>
              
              <div>
                <h3 className="font-semibold">{organization}</h3>
                <p className="text-sm mt-2">{location}</p>
                {internship.organization_description && (
                  <p className="mt-2">{internship.organization_description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailPage; 