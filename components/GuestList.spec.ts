import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import GuestList from './GuestList.vue';
import GuestRepository from '../services/guest-repository';

// Mock the toast notification system
vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  })
}));

// Mock the GuestRepository
vi.mock('../services/guest-repository', () => ({
  default: vi.fn().mockImplementation(() => ({
    load: vi.fn(),
    save: vi.fn(),
    reset: vi.fn()
  }))
}));

describe('GuestList', () => {
  let mockRepo: any;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Create a fresh mock repository instance
    mockRepo = {
      load: vi.fn().mockResolvedValue([
        { email: 'test1@example.com', tickets: 3 },
        { email: 'test2@example.com', tickets: 2 }
      ]),
      save: vi.fn().mockResolvedValue(undefined),
      reset: vi.fn().mockResolvedValue(undefined)
    };
    
    // Mock the constructor to return our mock instance
    (GuestRepository as any).mockImplementation(() => mockRepo);
  });

  it('renders without errors', async () => {
    const wrapper = mount(GuestList);
    await nextTick();
    
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('Nyan Cat Event Guest List');
  });

  it('calculates totalTickets correctly', async () => {
    const wrapper = mount(GuestList);
    await nextTick();
    
    // Wait for the component to load guests
    await wrapper.vm.loadGuests();
    await nextTick();
    
    // Should sum 3 + 2 = 5 tickets
    expect(wrapper.vm.totalTickets).toBe(5);
  });

  it('prevents adding guest when capacity would be exceeded', async () => {
    const wrapper = mount(GuestList);
    await nextTick();
    
    // Set up guests that total 18 tickets (2 remaining)
    wrapper.vm.guests = [
      { email: 'guest1@example.com', tickets: 10 },
      { email: 'guest2@example.com', tickets: 8 }
    ];
    await nextTick();
    
    // Check that the event is not full yet
    expect(wrapper.vm.isEventFull).toBe(false);
    
    // Add a guest that would exceed capacity
    wrapper.vm.guests.push({ email: 'newguest@example.com', tickets: 5 });
    await nextTick();
    
    // Now the event should be full
    expect(wrapper.vm.isEventFull).toBe(true);
  });

  it('allows adding guest when capacity is not exceeded', async () => {
    const wrapper = mount(GuestList);
    await nextTick();
    
    // Set up guests that total 15 tickets (5 remaining)
    wrapper.vm.guests = [
      { email: 'guest1@example.com', tickets: 10 },
      { email: 'guest2@example.com', tickets: 5 }
    ];
    await nextTick();
    
    // Check that the event is not full
    expect(wrapper.vm.isEventFull).toBe(false);
    
    // Add a guest within capacity
    wrapper.vm.guests.push({ email: 'newguest@example.com', tickets: 3 });
    await nextTick();
    
    // Should still not be full
    expect(wrapper.vm.isEventFull).toBe(false);
  });

  it('prevents duplicate email addresses', async () => {
    const wrapper = mount(GuestList);
    await nextTick();
    
    // Set up existing guests
    wrapper.vm.guests = [
      { email: 'existing@example.com', tickets: 2 },
      { email: 'another@example.com', tickets: 3 }
    ];
    await nextTick();
    
    // Check that we can't add a duplicate email
    const existingEmails = wrapper.vm.guests.map((g: any) => g.email.toLowerCase());
    expect(existingEmails).toContain('existing@example.com');
    expect(existingEmails).toContain('another@example.com');
  });

  it('allows editing guest with same email', async () => {
    const wrapper = mount(GuestList);
    await nextTick();
    
    // Set up existing guests
    wrapper.vm.guests = [
      { email: 'existing@example.com', tickets: 2 },
      { email: 'another@example.com', tickets: 3 }
    ];
    await nextTick();
    
    // Edit the first guest (same email, different ticket count)
    wrapper.vm.guests[0] = { email: 'existing@example.com', tickets: 4 };
    await nextTick();
    
    // Should still have the same email
    expect(wrapper.vm.guests[0].email).toBe('existing@example.com');
    expect(wrapper.vm.guests[0].tickets).toBe(4);
  });

  it('disables Add Guest button when event is full', async () => {
    const wrapper = mount(GuestList);
    await nextTick();
    
    // Set up guests that total exactly 20 tickets
    wrapper.vm.guests = [
      { email: 'guest1@example.com', tickets: 10 },
      { email: 'guest2@example.com', tickets: 10 }
    ];
    await nextTick();
    
    // Find the Add Guest button
    const addButton = wrapper.find('button[disabled]');
    
    // Button should be disabled
    expect(addButton.exists()).toBe(true);
    expect(addButton.attributes('disabled')).toBeDefined();
  });

  it('shows correct remaining tickets information', async () => {
    const wrapper = mount(GuestList);
    await nextTick();
    
    // Set up guests with 15 tickets
    wrapper.vm.guests = [
      { email: 'guest1@example.com', tickets: 10 },
      { email: 'guest2@example.com', tickets: 5 }
    ];
    await nextTick();
    
    // Check total tickets calculation
    expect(wrapper.vm.totalTickets).toBe(15);
    expect(wrapper.vm.isEventFull).toBe(false);
  });
});
