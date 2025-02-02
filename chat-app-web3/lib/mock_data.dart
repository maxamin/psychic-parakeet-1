import 'package:chat_app_web3/chat_models.dart';

List<ChatUser> chatUsers = [
  ChatUser(
      name: "Idriz Pelaj",
      messageText: "Awesome Setup",
      imageURL: "images/userImage1.jpeg",
      time: "Now"),
  ChatUser(
      name: "Jon Lumi",
      messageText: "That's Great",
      imageURL: "images/userImage2.jpeg",
      time: "Yesterday"),
  ChatUser(
      name: "Blert Shabani",
      messageText: "Hey where are you?",
      imageURL: "images/userImage3.jpeg",
      time: "31 Mar"),
  ChatUser(
      name: "Getoar Rexhepi",
      messageText: "Busy! Call me in 20 mins",
      imageURL: "images/userImage4.jpeg",
      time: "28 Mar"),
  ChatUser(
      name: "Altin Loshi",
      messageText: "Thankyou, It's awesome",
      imageURL: "images/userImage5.jpeg",
      time: "23 Mar"),
  ChatUser(
      name: "Joan Collaku",
      messageText: "will update you in evening",
      imageURL: "images/userImage6.jpeg",
      time: "17 Mar"),
  ChatUser(
      name: "Lis Fazliu",
      messageText: "Can you please share the file?",
      imageURL: "images/userImage7.jpeg",
      time: "24 Feb"),
  ChatUser(
      name: "Donat Balaj",
      messageText: "How are you?",
      imageURL: "images/userImage8.jpeg",
      time: "18 Feb"),
];

List<ChatMessage> messages = [
  ChatMessage(messageContent: "Hello, Will", messageType: "receiver"),
  ChatMessage(messageContent: "How have you been?", messageType: "receiver"),
  ChatMessage(
      messageContent: "Hey Kriss, I am doing fine dude. wbu?",
      messageType: "sender"),
  ChatMessage(messageContent: "ehhhh, doing OK.", messageType: "receiver"),
  ChatMessage(
      messageContent: "Is there any thing wrong?", messageType: "sender"),
];
