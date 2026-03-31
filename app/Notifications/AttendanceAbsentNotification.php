<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Student;
use Carbon\Carbon;

class AttendanceAbsentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Student $student, public Carbon $date)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Attendance Alert: Student Absent')
            ->line('This is to inform you that ' . $this->student->user->name . ' was marked ABSENT today.')
            ->line('Date: ' . $this->date->format('d M, Y'))
            ->line('If this is a mistake, please contact the school administration.')
            ->action('View Attendance', url('/attendance'))
            ->line('Thank you for using our school management system!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'student_id' => $this->student->id,
            'student_name' => $this->student->user->name,
            'date' => $this->date->toDateString(),
            'message' => 'Student was marked absent today.',
        ];
    }
}
