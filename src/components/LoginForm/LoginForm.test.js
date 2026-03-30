import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '.';

const fillAndSubmit = (email, password) => {
  render(<LoginForm />);
  userEvent.type(screen.getByLabelText(/email address/i), email);
  userEvent.type(screen.getByLabelText(/password/i), password);
  userEvent.click(screen.getByRole('button', { name: /sign in/i }));
};

test('renders sign in page', () => {
  render(<LoginForm />);
  expect(screen.getByText('Sign in')).toBeInTheDocument();
});

// --- Email validation ---

test('accepts a valid email', async () => {
  fillAndSubmit('user@example.com', 'ValidPass1!');
  await waitFor(() => expect(screen.queryByText('Invalid email')).not.toBeInTheDocument());
});

test('rejects an email missing @', async () => {
  fillAndSubmit('notanemail', 'ValidPass1!');
  await waitFor(() => expect(screen.getByText('Invalid email')).toBeInTheDocument());
});

test('rejects an email missing domain', async () => {
  fillAndSubmit('user@', 'ValidPass1!');
  await waitFor(() => expect(screen.getByText('Invalid email')).toBeInTheDocument());
});

test('rejects an empty email', async () => {
  fillAndSubmit('', 'ValidPass1!');
  await waitFor(() => expect(screen.getByText('Invalid email')).toBeInTheDocument());
});

// --- Password validation ---

test('accepts a password meeting all requirements', async () => {
  fillAndSubmit('user@example.com', 'ValidPass1!');
  await waitFor(() => expect(screen.queryByText('Invalid password')).not.toBeInTheDocument());
});

test('rejects a password shorter than 8 characters', async () => {
  fillAndSubmit('user@example.com', 'Ab1!');
  await waitFor(() => expect(screen.getByText('Invalid password')).toBeInTheDocument());
});

test('rejects a password without an uppercase letter', async () => {
  fillAndSubmit('user@example.com', 'validpass1!');
  await waitFor(() => expect(screen.getByText('Invalid password')).toBeInTheDocument());
});

test('rejects a password without a lowercase letter', async () => {
  fillAndSubmit('user@example.com', 'VALIDPASS1!');
  await waitFor(() => expect(screen.getByText('Invalid password')).toBeInTheDocument());
});

test('rejects a password without a digit', async () => {
  fillAndSubmit('user@example.com', 'ValidPass!');
  await waitFor(() => expect(screen.getByText('Invalid password')).toBeInTheDocument());
});

test('rejects a password without a special character', async () => {
  fillAndSubmit('user@example.com', 'ValidPass1');
  await waitFor(() => expect(screen.getByText('Invalid password')).toBeInTheDocument());
});

test('rejects an empty password', async () => {
  fillAndSubmit('user@example.com', '');
  await waitFor(() => expect(screen.getByText('Invalid password')).toBeInTheDocument());
});

// --- Combined ---

test('shows both error messages when email and password are invalid', async () => {
  fillAndSubmit('notanemail', 'weak');
  await waitFor(() => {
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByText('Invalid password')).toBeInTheDocument();
  });
});

test('shows success alert on valid email and password', async () => {
  fillAndSubmit('user@example.com', 'ValidPass1!');
  await waitFor(() => expect(screen.getByText('Login Successful')).toBeInTheDocument());
});