import { authService, API_URL } from './authService';

export interface Meeting {
  _id: string;
  course: { _id: string; name: string };
  students: string[];
  tutor: { _id: string; fullName: string };
  date: Date; // Đã chuyển thành Date
  time: Date; // Đã chuyển thành Date
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  cancelledBy?: { _id: string; fullName: string };
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
  formattedDateTime?: string;
}

class MeetingService {
  private convertMeetingDates(meeting: any): Meeting {
    return {
      ...meeting,
      date: meeting.date ? new Date(meeting.date) : null,
      time: meeting.time ? new Date(`1970-01-01T${meeting.time}Z`) : null, // Giả định time là HH:MM:SS
      createdAt: meeting.createdAt ? new Date(meeting.createdAt) : null,
      updatedAt: meeting.updatedAt ? new Date(meeting.updatedAt) : null,
    } as Meeting;
  }

  private convertMeetingArrayDates(meetings: any[]): Meeting[] {
    return meetings.map(meeting => this.convertMeetingDates(meeting));
  }

  async createMeeting(meetingData: Partial<Meeting>): Promise<Meeting> {
    try {
      const headers = {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${API_URL}/meetings/create-meeting`, {
        method: 'POST',
        headers,
        body: JSON.stringify(meetingData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to create meeting');
      }

      return this.convertMeetingDates(await response.json());
    } catch (error) {
      console.error('Error in createMeeting:', error);
      throw error;
    }
  }

  async getMeeting(meetingId: string): Promise<Meeting> {
    try {
      const response = await fetch(`${API_URL}/meetings/get-meeting/${meetingId}`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch meeting');
      }

      return this.convertMeetingDates(await response.json());
    } catch (error) {
      console.error('Error in getMeeting:', error);
      throw error;
    }
  }

  async getAllMeetings(): Promise<Meeting[]> {
    try {
      const response = await fetch(`${API_URL}/meetings/get-meetings`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch meetings');
      }

      const data = await response.json();
      return Array.isArray(data) ? this.convertMeetingArrayDates(data) : [];
    } catch (error) {
      console.error('Error in getAllMeetings:', error);
      throw error;
    }
  }

  async updateMeeting(meetingId: string, meetingData: Partial<Meeting>): Promise<Meeting> {
    try {
      const headers = {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${API_URL}/meetings/update-meeting/${meetingId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(meetingData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to update meeting');
      }

      return this.convertMeetingDates(await response.json());
    } catch (error) {
      console.error('Error in updateMeeting:', error);
      throw error;
    }
  }

  async deleteMeeting(meetingId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/meetings/delete-meeting/${meetingId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete meeting');
      }
    } catch (error) {
      console.error('Error in deleteMeeting:', error);
      throw error;
    }
  }

  // async joinMeeting(meetingId: string): Promise<void> {
  //   try {
  //     const response = await fetch(`${API_URL}/meetings/join-meeting/${meetingId}`, {
  //       method: 'POST',
  //       headers: authService.getAuthHeaders()
  //     });

  //     if (!response.ok) {
  //       if (response.status === 401) {
  //         authService.removeToken();
  //         throw new Error('Authentication required');
  //       }
  //       const error = await response.json();
  //       throw new Error(error.message || 'Failed to join meeting');
  //     }
  //   } catch (error) {
  //     console.error('Error in joinMeeting:', error);
  //     throw error;
  //   }
  // }
  async joinMeeting(meetingId: string): Promise<string> {
    try {
      // No need to process the response or backend link.
      // We are directly returning the Google Meet link.
      return "https://meet.google.com/utd-bive-rmy";

    } catch (error) {
      console.error('Error in joinMeeting:', error);
      return "https://meet.google.com/utd-bive-rmy"; // Still return the link on error
      throw error; // Optionally re-throw the error for the calling component to handle
    }
  }

  async leaveMeeting(meetingId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/meetings/leave-meeting/${meetingId}/leave`, {
        method: 'POST',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to leave meeting');
      }
    } catch (error) {
      console.error('Error in leaveMeeting:', error);
      throw error;
    }
  }

  async getMeetingParticipants(meetingId: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_URL}/meetings/getmeetingparti/${meetingId}/participants`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch meeting participants');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getMeetingParticipants:', error);
      throw error;
    }
  }

  async getMeetingSchedule(): Promise<Meeting[]> {
    try {
      const response = await fetch(`${API_URL}/meetings/get-schedule`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch meeting schedule');
      }

      return this.convertMeetingArrayDates(await response.json());
    } catch (error) {
      console.error('Error in getMeetingSchedule:', error);
      throw error;
    }
  }

  async getUpcomingMeetings(): Promise<Meeting[]> {
    try {
      const response = await fetch(`${API_URL}/meetings/upcoming`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch upcoming meetings');
      }

      return this.convertMeetingArrayDates(await response.json());
    } catch (error) {
      console.error('Error in getUpcomingMeetings:', error);
      throw error;
    }
  }
}

export const meetingService = new MeetingService();