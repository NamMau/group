import { authService, API_URL } from './authService';

export interface Meeting {
  _id?: string;
  classId: string;
  courseId: {
    _id: string;
    name: string;
  };
  students: {
    _id: string;
    fullName: string;
    email: string;
  }[];
  tutorId: string;
  date: Date;
  time: string;  // HH:mm format
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

class MeetingService {
  private convertMeetingDates(meeting: any): Meeting | null {
    if (!meeting) return null;
    
    return {
      ...meeting,
      date: new Date(meeting.date),
      time: meeting.time || '',  // Keep as string HH:mm
      createdAt: meeting.createdAt || undefined,
      updatedAt: meeting.updatedAt || undefined,
    };
  }

  private convertMeetingArrayDates(meetings: any[]): Meeting[] {
    return meetings.map(meeting => this.convertMeetingDates(meeting)).filter((meeting): meeting is Meeting => meeting !== null);
  }

  async createMeeting(meetingData: Partial<Meeting>): Promise<Meeting> {
    try {
      const headers = {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const payload = {
        classId: meetingData.classId,
        date: meetingData.date,
        time: meetingData.time,
        duration: meetingData.duration,
      };

      const response = await fetch(`${API_URL}/meetings/create-meeting`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      const convertedMeeting = this.convertMeetingDates(await response.json());
      if (!convertedMeeting) {
        throw new Error('Failed to create meeting: Invalid response data');
      }
      return convertedMeeting;
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
        await this.handleHttpError(response);
      }

      const convertedMeeting = this.convertMeetingDates(await response.json());
      if (!convertedMeeting) {
        throw new Error('Meeting not found or invalid data');
      }
      return convertedMeeting;
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
        await this.handleHttpError(response);
      }

      const meetings = await response.json();
      return this.convertMeetingArrayDates(meetings);
    } catch (error) {
      console.error('Error in getAllMeetings:', error);
      throw error;
    }
  }

  async getMeetingsByTutor(tutorId: string): Promise<Meeting[]> {
    try {
      const response = await fetch(`${API_URL}/meetings/tutor/${tutorId}`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      const meetings = await response.json();
      return this.convertMeetingArrayDates(meetings);
    } catch (error) {
      console.error('Error in getMeetingsByTutor:', error);
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
        await this.handleHttpError(response);
      }

      const convertedMeeting = this.convertMeetingDates(await response.json());
      if (!convertedMeeting) {
        throw new Error('Failed to update meeting: Invalid response data');
      }
      return convertedMeeting;
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
        await this.handleHttpError(response); // Sử dụng hàm xử lý lỗi chung
      }
    } catch (error) {
      console.error('Error in deleteMeeting:', error);
      throw error;
    }
  }

  private async handleHttpError(response: Response): Promise<void> {
    if (response.status === 401) {
      authService.removeToken();
      throw new Error('Authentication required');
    }
    
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred');
    } catch (e) {
      throw new Error('Failed to process error response');
    }
  }

  async joinMeeting(meetingId: string): Promise<string> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/meetings/join-meeting/${meetingId}`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      const data = await response.json();
      if (!data || !data.meetingLink) {
        throw new Error('No meeting link provided');
      }

      return data.meetingLink;
    } catch (error) {
      console.error('Error in joinMeeting:', error);
      throw error;
    }
  }

  async leaveMeeting(meetingId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/meetings/leave-meeting/${meetingId}/leave`, {
        method: 'POST',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        await this.handleHttpError(response); // Sử dụng hàm xử lý lỗi chung
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
        await this.handleHttpError(response); // Sử dụng hàm xử lý lỗi chung
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
        await this.handleHttpError(response); // Sử dụng hàm xử lý lỗi chung
      }

      const data = await response.json();
      return this.convertMeetingArrayDates(data);
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
        await this.handleHttpError(response); // Sử dụng hàm xử lý lỗi chung
      }
      const data = await response.json();
      return this.convertMeetingArrayDates(data);
    } catch (error) {
      console.error('Error in getUpcomingMeetings:', error);
      throw error;
    }
  }

  async cancelMeeting(meetingId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/meetings/cancel/${meetingId}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }
    } catch (error) {
      console.error('Error in cancelMeeting:', error);
      throw error;
    }
  }
}

export const meetingService = new MeetingService();
