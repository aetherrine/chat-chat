from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message by {self.user.username} at {self.created_at}'


class Vote(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='votes')
    value = models.IntegerField(default=0)  # 1 for upvote, -1 for downvote

    def __str__(self):
        return f'{self.user.username} {"upvoted" if self.value > 0 else "downvoted"} message {self.message.id}'

    class Meta:
        unique_together = ('message', 'user')  # Ensure one vote per user per message
