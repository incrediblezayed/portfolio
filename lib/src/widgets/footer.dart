import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/utils/providers.dart';
import 'package:portfolio/src/widgets/contact_form.dart';
import 'package:portfolio/src/widgets/os_info.dart';
import 'package:portfolio/src/widgets/socials.dart';

class Footer extends ConsumerWidget {
  const Footer({super.key});
  static const String routeName = 'Footer';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appTheme = ref.watch(themeProvider);
    final mediaQueryData = MediaQuery.of(context);
    return Container(
      color: appTheme.primaryColor,
      width: mediaQueryData.size.width,
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        bottom: mediaQueryData.viewPadding.bottom + 8.0,
      ),
      child: const Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Expanded(
            flex: 3,
            child: ContactForm(),
          ),
          Socials(),
          OSInfo(),
        ],
      ),
    );
  }
}
