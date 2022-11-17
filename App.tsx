import { StripeProvider } from '@stripe/stripe-react-native';
import CheckoutScreen from './CheckoutScreen';

export default function App() {
  return (
    <StripeProvider
      publishableKey="pk_test_51LxoKKHqMywXhbC79U1iNbpdJObZir61ouukdBjw1g5OVwnIdcLQmJju8uq5UDxDB8edvSCIT2sxVAVmzDkJ626I00m7XU3GGc"
      merchantIdentifier="merchant.com.example"
    >
      <CheckoutScreen />
    </StripeProvider>
  );
}
