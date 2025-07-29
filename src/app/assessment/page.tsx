'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Import the actual assessment content component
import AssessmentForm from './AssessmentForm';

export default function AssessmentPageWrapper() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token on /assessment:', token); // DEBUG
    if (!token) {
      router.push('/auth');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return <AssessmentForm />;
}
