import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/utils/constants.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/utils/providers.dart';
import 'package:portfolio/src/utils/theme.dart';
import 'package:portfolio/src/widgets/social_buttons.dart';

class Footer extends ConsumerWidget {
  static const String routeName = "Footer";
  const Footer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ThemeData theme = Theme.of(context);
    AppTheme appTheme = ref.watch(themeProvider);
    MediaQueryData mediaQueryData = MediaQuery.of(context);
    return Container(
      color: theme.colorScheme.background,
      width: mediaQueryData.size.width,
      padding: EdgeInsets.only(
          left: 16.0,
          top: 8.0,
          right: 16.0,
          bottom: (mediaQueryData.viewPadding.bottom + 8.0)),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Hero(
              tag: Constants.dividerTag,
              child: Material(
                type: MaterialType.transparency,
                child: Divider(
                  thickness: 2,
                  indent: 50,
                  endIndent: 50,
                  color: theme.colorScheme.onSurface,
                ),
              )),
          SizedBox(
            width: mediaQueryData.size.width,
            child: Wrap(
              crossAxisAlignment: WrapCrossAlignment.end,
              alignment: WrapAlignment.spaceBetween,
              spacing: 8.0,
              runSpacing: 16,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      "Running on ${DeviceUtils.getCurrentPlaform()} 🚀 ${DeviceUtils.getOSVersion()}",
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w100,
                      ),
                    ),
                    const SizedBox(
                      height: 4,
                    ),
                    const Text(
                      "Working on all platforms! (Android, iOS, linux, Window, macOS, Web) 🎉",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w100,
                      ),
                    )
                  ],
                ),
                Wrap(
                  children: [
                    SocialButton(
                      iconColor: appTheme.instagramColor,
                      onPressed: () {},
                      icon: FontAwesomeIcons.instagram,
                    ),
                    SocialButton(
                      icon: FontAwesomeIcons.twitter,
                      iconColor: appTheme.twitterColor,
                      onPressed: () {},
                    ),
                    SocialButton(
                      icon: FontAwesomeIcons.discord,
                      onPressed: () {},
                      iconColor: appTheme.discordColor,
                    ),
                    SocialButton(
                      iconColor: appTheme.whatsappColor,
                      onPressed: () {},
                      icon: FontAwesomeIcons.whatsapp,
                    ),
                    SocialButton(
                      onPressed: () {},
                      iconColor: appTheme.githubColor,
                      icon: FontAwesomeIcons.github,
                    ),
                    SocialButton(
                      icon: FontAwesomeIcons.linkedin,
                      onPressed: () {},
                      iconColor: appTheme.linkedinColor,
                    ),
                  ],
                ),
                const Text(
                  "Developed with Flutter ❤️, by Hassan Ansari 🤓",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w100,
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
