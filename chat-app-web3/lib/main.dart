import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'metamask_provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'mock_data.dart';
import 'conversation_list.dart';

void main() {
  runApp(
    const MaterialApp(
      home: MyApp(),
      title: "Chat App",
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 12, 50, 100),
      body: ChangeNotifierProvider(
        create: (context) => MetamaskProvider()..start(),
        builder: (context, child) {
          return Center(child: Consumer<MetamaskProvider>(
            builder: (context, provider, child) {
              late final String message;
              if (provider.isConnected && provider.isInOperatingChain) {
                return Scaffold(
                  body: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        SafeArea(
                          child: Padding(
                            padding: const EdgeInsets.only(
                                left: 16, right: 16, top: 10),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: <Widget>[
                                const Text(
                                  'Conversations',
                                  style: TextStyle(
                                      fontSize: 32,
                                      fontWeight: FontWeight.bold),
                                ),
                                Container(
                                  padding: const EdgeInsets.only(
                                      left: 8, right: 8, top: 2, bottom: 2),
                                  height: 30,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(30),
                                    color: Colors.pink[50],
                                  ),
                                  child: const Row(
                                    children: <Widget>[
                                      Icon(
                                        Icons.add,
                                        color: Colors.pink,
                                        size: 20,
                                      ),
                                      SizedBox(
                                        width: 2,
                                      ),
                                      Text(
                                        "Add New",
                                        style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(
                              top: 16, left: 16, right: 16),
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: "Search...",
                              hintStyle: TextStyle(color: Colors.grey.shade600),
                              prefixIcon: Icon(
                                Icons.search,
                                color: Colors.grey.shade600,
                                size: 20,
                              ),
                              filled: true,
                              fillColor: Colors.grey.shade100,
                              contentPadding: const EdgeInsets.all(8),
                              enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(20),
                                  borderSide:
                                      BorderSide(color: Colors.grey.shade100)),
                            ),
                          ),
                        ),
                        ListView.builder(
                          itemCount: chatUsers.length,
                          shrinkWrap: true,
                          padding: const EdgeInsets.only(top: 16),
                          physics: const NeverScrollableScrollPhysics(),
                          itemBuilder: (context, index) {
                            return ConversationList(
                              name: chatUsers[index].name,
                              messageText: chatUsers[index].messageText,
                              imageUrl: chatUsers[index].imageURL,
                              time: chatUsers[index].time,
                              isMessageRead:
                                  (index == 0 || index == 3) ? true : false,
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                );
              } else if (provider.isConnected && !provider.isInOperatingChain) {
                message =
                    'Wrong chain. Please connect to ${MetamaskProvider.operatingChain}';
              } else if (provider.isEnabled) {
                return Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(15),
                      child: Text(
                        "Welcome to Chat App!",
                        textAlign: TextAlign.center,
                        style: GoogleFonts.splineSansMono(
                            fontSize: 30, color: Colors.orange),
                      ),
                    ),
                    MaterialButton(
                      onPressed: () =>
                          context.read<MetamaskProvider>().connect(),
                      color: Colors.indigo,
                      padding: const EdgeInsets.all(0),
                      child: Row(mainAxisSize: MainAxisSize.min, children: [
                        Image.network(
                          'https://images.unsplash.com/photo-1637597384338-61f51fa5cb07?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                          width: 300,
                        )
                      ]),
                    )
                  ],
                );
              } else {
                message = 'Please use a Web3 supported browser.';
              }
              return Text(
                message,
                textAlign: TextAlign.center,
                textDirection: TextDirection.ltr,
                style: const TextStyle(color: Colors.white),
              );
            },
          ));
        },
      ),
    );
  }
}
