import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Plus } from 'lucide-react';
import { toast } from 'sonner';
import api, { getApiError } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../ui/Button.jsx';

export default function FollowButton({ profileUser, initialFollowing = false, onChange, size = 'md' }) {
  const { user, isAuthenticated, refresh } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  if (!profileUser || user?.id === profileUser.id) return null;

  const toggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setLoading(true);
    try {
      const { data } = following
        ? await api.delete(`/users/${profileUser.id}/follow`)
        : await api.post(`/users/${profileUser.id}/follow`);
      setFollowing(data.data.following);
      onChange?.(data.data.following);
      toast.success(data.message);
      refresh();
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={following ? 'outline' : 'lime'}
      size={size}
      loading={loading}
      onClick={toggle}
      aria-pressed={following}
    >
      {!loading && (following ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />)}
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
