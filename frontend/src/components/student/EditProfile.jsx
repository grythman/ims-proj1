import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserCog } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../UI/Card';
import studentApi from '../../services/studentApi';

const EditProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await studentApi.profile.getProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateProfile = (data) => {
    const errors = {};
    if (!data.firstName?.trim()) errors.firstName = 'First name is required';
    if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!data.email?.trim()) errors.email = 'Email is required';
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Invalid email format';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const validationErrors = validateProfile(profile);
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors).join(', '));
      setSaving(false);
      return;
    }

    try {
      await studentApi.profile.updateProfile(profile);
      toast.success('Profile updated successfully');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      await studentApi.profile.uploadProfilePicture(formData);
      toast.success('Profile picture updated');
    } catch (err) {
      toast.error('Failed to upload profile picture');
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="rounded-lg bg-emerald-500/10 p-2 w-fit">
          <UserCog className="h-6 w-6 text-emerald-500" />
        </div>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Add your form fields here */}
          </div>
          
          {/* Profile Picture Upload */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('profile-picture').click()}
              >
                Choose File
              </Button>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-sm text-gray-500">
                {profile?.profilePicture ? 'Change picture' : 'Upload a profile picture'}
              </span>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={saving}
              loading={saving}
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProfile;