import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { CheckCircle, Clock, Upload, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { getUser } from '@/utils/auth';
import { toast } from 'react-toastify';

const Payment = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const response = await api.get('/payment/status');
      setPaymentStatus(response.data);
      
      if (response.data.status === 'completed') {
        toast.info('Payment already completed!');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const response = await api.post('/payment/initiate', {
        user_id: user.id,
        phone_number: user.phone
      });
      setPaymentInfo(response.data);
      toast.success('Payment instructions sent!');
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to initiate payment';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const uploadProof = async () => {
    if (!proofUrl) {
      toast.error('Please enter proof URL');
      return;
    }

    setLoading(true);
    try {
      await api.post('/payment/manual-proof', {
        user_id: user.id,
        proof_url: proofUrl
      });
      toast.success('Payment proof uploaded successfully!');
      setTimeout(() => {
        checkPaymentStatus();
      }, 1000);
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to upload proof';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8">Registration Payment</h1>

        {/* Payment Status */}
        {paymentStatus && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {paymentStatus.status === 'completed' ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-700">Payment Completed</p>
                      <p className="text-sm text-gray-600">You can now post vehicles</p>
                    </div>
                  </>
                ) : paymentStatus.status === 'manual_review' ? (
                  <>
                    <Clock className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="font-semibold text-orange-700">Under Review</p>
                      <p className="text-sm text-gray-600">Admin will verify your payment proof</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-semibold text-blue-700">Payment Pending</p>
                      <p className="text-sm text-gray-600">Complete payment to post vehicles</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registration Fee: 7,500 FCFA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-primary">MTN Mobile Money Payment</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Recipient Number:</strong> +242 068 913 333</p>
                <p><strong>Merchant Code:</strong> 374575</p>
                <p><strong>Amount:</strong> 7,500 FCFA</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Payment Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Open MTN Mobile Money on your phone</li>
                <li>Select "Send Money" or "Pay Merchant"</li>
                <li>Enter merchant code: <strong>374575</strong> or number: <strong>+242 068 913 333</strong></li>
                <li>Enter amount: <strong>7,500 FCFA</strong></li>
                <li>Confirm the transaction</li>
                <li>Upload proof below or wait for automatic verification</li>
              </ol>
            </div>

            {!paymentInfo && (
              <Button
                onClick={initiatePayment}
                disabled={loading || paymentStatus?.status === 'completed'}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Initiate Payment'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Manual Proof Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Payment Proof (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              If you've already completed the payment, you can upload a screenshot as proof.
              This will be verified by our admin team.
            </p>

            <div>
              <Label htmlFor="proofUrl">Proof URL (Screenshot link)</Label>
              <Input
                id="proofUrl"
                type="url"
                placeholder="https://example.com/payment-proof.jpg"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                disabled={paymentStatus?.status === 'completed'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your screenshot to imgur.com or similar service and paste the link here
              </p>
            </div>

            <Button
              onClick={uploadProof}
              disabled={loading || paymentStatus?.status === 'completed' || !proofUrl}
              className="w-full"
            >
              {loading ? 'Uploading...' : 'Submit Payment Proof'}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;