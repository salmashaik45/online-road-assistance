import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

function ReviewPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get(`/services/${requestId}`);
        if (res.data.data?.status !== 'completed') {
          toast.error('Only completed services can be reviewed');
          navigate('/my-requests');
        }
      } catch {
        toast.error('Unable to load request');
        navigate('/my-requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [navigate, requestId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews', { requestId, rating, comment });
      toast.success('Thank you for your review!');
      navigate('/my-requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface-variant">
        Loading review form...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background px-6 py-12 relative overflow-hidden flex items-center justify-center">
      {/* Background accents */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[700px] w-full bg-surface rounded-3xl border border-outline-variant p-8 md:p-12 shadow-sm relative z-10">
        <button
          onClick={() => navigate('/my-requests')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-bold"
        >
          <ArrowLeft size={18} /> Back to Requests
        </button>
        <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface mb-3">
          Leave a Review
        </h1>
        <p className="text-lg text-on-surface-variant mb-8 pb-8 border-b border-outline-variant">
          Share your experience with the service provider.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="font-bold text-on-surface-variant text-sm uppercase tracking-wider block mb-3">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="p-3 bg-surface-variant border border-outline-variant rounded-2xl hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <Star
                    size={36}
                    className={value <= rating ? 'text-yellow-500 fill-current' : 'text-on-surface-variant'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-on-surface-variant text-sm uppercase tracking-wider block mb-3">
              Comment
            </label>
            <textarea
              className="w-full min-h-[160px] p-5 bg-background border border-outline-variant rounded-2xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the service experience..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[60px] bg-primary text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 mt-4 flex items-center justify-center"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewPage;
