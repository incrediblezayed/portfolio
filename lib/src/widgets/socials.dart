import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/widgets/social_buttons.dart';

class Socials extends ConsumerWidget {
  const Socials({super.key});
  static const String routeName = 'Socials';
  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) =>
      'Socials';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mediaQueryData = MediaQuery.of(context);
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    final appTheme = ref.watch(themeProvider);
    return Padding(
      padding: EdgeInsets.only(bottom: mediaQueryData.size.height * 0.01),
      child: Wrap(
        alignment: WrapAlignment.center,
        crossAxisAlignment: WrapCrossAlignment.center,
        spacing: width * 0.1,
        children: [
          Text(
            'Socials',
            style: TextStyle(
              fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                mediaQuerySize: width,
                minSize: 14,
                multiplier: 0.08,
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.only(top: mediaQueryData.size.height * 0.006),
            child: Wrap(
              runSpacing: width * 0.02,
              spacing: width * 0.02,
              children: [
                SocialButton(
                  socialName: 'Instagram',
                  iconColor: appTheme.instagramColor,
                  icon: FontAwesomeIcons.instagram,
                  url: 'https://www.instagram.com/incrediblezayed/',
                ),
                SocialButton(
                  socialName: 'Twitter',
                  icon: FontAwesomeIcons.twitter,
                  iconColor: appTheme.twitterColor,
                  url: 'https://twitter.com/incrediblezayed',
                ),
                SocialButton(
                  socialName: 'Discord',
                  icon: FontAwesomeIcons.discord,
                  url: 'https://discordapp.com/users/775966362358120479',
                  iconColor: appTheme.discordColor,
                ),
                SocialButton(
                  socialName: 'WhatsApp',
                  iconColor: appTheme.whatsappColor,
                  url: 'https://wa.me/+919158363588',
                  icon: FontAwesomeIcons.whatsapp,
                ),
                SocialButton(
                  socialName: 'GitHub',
                  iconColor: appTheme.githubColor,
                  url: 'https://github.com/incrediblezayed',
                  icon: FontAwesomeIcons.github,
                ),
                SocialButton(
                  socialName: 'LinkedIn',
                  icon: FontAwesomeIcons.linkedin,
                  url: 'https://www.linkedin.com/in/incrediblezayed/',
                  iconColor: appTheme.linkedinColor,
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
