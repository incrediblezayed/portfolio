import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/models/enquiry_model.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/repositories/enquiry_repository.dart';
import 'package:portfolio/src/utils/device_utils.dart';

class ContactForm extends ConsumerWidget {
  const ContactForm({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final nameController = TextEditingController();
    final emailController = TextEditingController();
    final phoneController = TextEditingController();
    final messageController = TextEditingController();
    final theme = Theme.of(context);
    final mediaQueryData = MediaQuery.of(context);
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    final appTheme = ref.watch(themeProvider);
    return Wrap(
      alignment: WrapAlignment.spaceAround,
      runAlignment: WrapAlignment.spaceAround,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: SizedBox(
            width: width * 0.8,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Shoot your questions here!',
                  style: TextStyle(
                    height: 0.9,
                    fontSize: width * 0.07,
                    fontWeight: FontWeight.w100,
                  ),
                ),
                Text(
                  "I'll reply as soon as possible!",
                  style: TextStyle(
                    fontSize: width * 0.03,
                    fontWeight: FontWeight.w100,
                  ),
                ),
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: 16),
          child: SizedBox(
            width: width * 0.8,
            child: Column(
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    hintText: 'Name',
                    prefixIcon: Icon(
                      FontAwesomeIcons.userAstronaut,
                      size: 18,
                    ),
                  ),
                ),
                const SizedBox(
                  height: 12,
                ),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    hintText: 'Email',
                    prefixIcon: Icon(
                      FontAwesomeIcons.envelopeOpenText,
                      size: 18,
                    ),
                  ),
                ),
                const SizedBox(
                  height: 12,
                ),
                TextField(
                  controller: phoneController,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                  ],
                  decoration: const InputDecoration(
                    hintText: 'Phone',
                    prefixIcon: Icon(
                      FontAwesomeIcons.mobileRetro,
                      size: 18,
                    ),
                  ),
                ),
                const SizedBox(
                  height: 12,
                ),
                SizedBox(
                  height: mediaQueryData.size.height * 0.1,
                  child: TextField(
                    controller: messageController,
                    maxLines: 5,
                    decoration: const InputDecoration(
                      hintText: 'Question',
                      prefixIcon: Icon(
                        FontAwesomeIcons.message,
                        size: 18,
                      ),
                    ),
                  ),
                ),
                const SizedBox(
                  height: 20,
                ),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ButtonStyle(
                      textStyle: appTheme.getMaterialStateProperty(
                        defaultValue: const TextStyle(
                          fontWeight: FontWeight.normal,
                        ),
                        hovered: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                        pressed: const TextStyle(
                          fontWeight: FontWeight.w100,
                        ),
                      ),
                      fixedSize: MaterialStateProperty.all(
                        const Size(double.infinity, 48),
                      ),
                      shadowColor: appTheme.getMaterialStateProperty(
                        defaultValue: theme.colorScheme.primary,
                      ),
                      elevation: appTheme.getMaterialStateProperty(
                        defaultValue: 4,
                        hovered: 8,
                        pressed: 0,
                        focused: 0,
                      ),
                      shape: appTheme.getMaterialStateProperty(
                        defaultValue: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                    onPressed: () async {
                      void showSnackbar({required Widget content}) {
                        ScaffoldMessenger.of(context).hideCurrentSnackBar();
                        ScaffoldMessenger.of(context)
                            .showSnackBar(SnackBar(content: content));
                      }

                      if (nameController.text.isEmpty) {
                        showSnackbar(
                          content: const Text(
                            'Please enter your name!',
                          ),
                        );
                        return;
                      }

                      if (emailController.text.isEmpty) {
                        showSnackbar(
                          content: const Text(
                            'Please enter your email!',
                          ),
                        );
                        return;
                      }

                      if (messageController.text.isEmpty) {
                        showSnackbar(
                          content: const Text(
                            'Please enter your question!',
                          ),
                        );
                        return;
                      }
                      showSnackbar(
                        content: const Row(
                          children: [
                            SizedBox.square(
                              dimension: 26,
                              child: FittedBox(
                                child: CircularProgressIndicator(),
                              ),
                            ),
                            SizedBox(
                              width: 10,
                            ),
                            Text(
                              'Submitting...',
                            ),
                          ],
                        ),
                      );
                      final response = await EnquiryRepository().addEnquiry(
                        EnquiryModel(
                          id: '',
                          name: nameController.text,
                          email: emailController.text,
                          message: messageController.text,
                          phone: phoneController.text,
                          createdAt: '',
                        ),
                      );

                      if (response) {
                        nameController.clear();
                        emailController.clear();
                        phoneController.clear();
                        messageController.clear();

                        showSnackbar(
                          content: const Text(
                            "Submitted Successfully! I'll get back to you soon!",
                          ),
                        );
                      } else {
                        log('Failed to submit!');
                        showSnackbar(
                          content: const Text(
                            'Failed to submit! Please try again! later',
                          ),
                        );
                      }
                    },
                    child: const Text('Submit'),
                  ),
                )
              ],
            ),
          ),
        )
      ],
    );
  }
}
