// import 'package:flutter/cupertino.dart';
class ChatUser {
  String name;
  String messageText;
  String imageURL;
  String time;
  ChatUser(
      {required this.name,
      required this.messageText,
      required this.imageURL,
      required this.time});
}

class ChatMessage {
  String messageContent;
  String messageType;
  ChatMessage({required this.messageContent, required this.messageType});
}
