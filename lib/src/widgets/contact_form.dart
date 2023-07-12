import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/utils/providers.dart';

class ContactForm extends ConsumerWidget {
  const ContactForm({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
                const TextField(
                  decoration: InputDecoration(
                    labelText: 'Name',
                    prefixIcon: Icon(
                      FontAwesomeIcons.userAstronaut,
                      size: 18,
                    ),
                    prefixIconColor: Colors.white,
                  ),
                ),
                const SizedBox(
                  height: 12,
                ),
                const TextField(
                  decoration: InputDecoration(
                    labelText: 'Email',
                    prefixIcon: Icon(
                      FontAwesomeIcons.envelopeOpenText,
                      size: 18,
                    ),
                    prefixIconColor: Colors.white,
                  ),
                ),
                const SizedBox(
                  height: 12,
                ),
                const TextField(
                  decoration: InputDecoration(
                    labelText: 'Phone',
                    prefixIcon: Icon(
                      FontAwesomeIcons.mobileRetro,
                      size: 18,
                    ),
                    prefixIconColor: Colors.white,
                  ),
                ),
                const SizedBox(
                  height: 12,
                ),
                SizedBox(
                  height: mediaQueryData.size.height * 0.1,
                  child: const TextField(
                    maxLines: 5,
                    decoration: InputDecoration(
                      labelText: 'Question',
                      prefixIcon: Icon(
                        FontAwesomeIcons.message,
                        size: 18,
                      ),
                      prefixIconColor: Colors.white,
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
                    onPressed: () {},
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
