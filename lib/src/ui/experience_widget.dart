import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio_core_data/portfolio_core_data.dart';

class ExperienceTitleWidget extends ConsumerWidget {
  const ExperienceTitleWidget({required this.experiences, super.key});
  final List<ExperienceModel> experiences;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mediaQueryData = MediaQuery.of(context);
    final appTheme = ref.watch(themeProvider);
    final mainPro = ref.watch(mainProvider);
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    final isLandscape = mediaQueryData.orientation == Orientation.landscape;
    Widget experienceTitleWidget({
      required ExperienceModel experienceModel,
      required bool isRight,
    }) {
      return Column(
        key: ValueKey(experienceModel.company),
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            experienceModel.company,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: appTheme.getAlternatePrimaryColor(),
              fontWeight: FontWeight.bold,
              fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                mediaQuerySize: width,
                minSize: 16,
                multiplier: 0.08,
                maxSize: isLandscape ? 70 : 36,
              ),
            ),
          ),
          Text(
            "${DateFormat("MMMM yyyy").format(experienceModel.startDate)} - ${experienceModel.endDate == null ? "Present" : DateFormat("MMMM yyyy").format(experienceModel.endDate!)}",
            style: TextStyle(
              fontWeight: FontWeight.w300,
              fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                mediaQuerySize: width,
                minSize: 16,
                multiplier: 0.04,
                maxSize: 24,
              ),
            ),
          ),
          Text(
            experienceModel.location,
            style: TextStyle(
              fontWeight: FontWeight.w100,
              fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                mediaQuerySize: width,
                minSize: 16,
                multiplier: 0.04,
                maxSize: 24,
              ),
            ),
          ),
        ],
      );
    }

    return SizedBox(
      height: isLandscape ? null : mediaQueryData.size.height * 0.15,
      child: AnimatedBuilder(
        animation: mainPro.workExperiencePageController,
        builder: (context, child) {
          final experienceModel = experiences[mainPro.workExperiencePageIndex];
          return AnimatedSwitcher(
            duration: const Duration(
              milliseconds: 300,
            ),
            child: experienceTitleWidget(
              experienceModel: experienceModel,
              isRight: true,
            ),
          );
        },
      ),
    );
  }
}

class ExperenceDetailWidget extends ConsumerWidget {
  const ExperenceDetailWidget(this.experienceModel, {super.key});
  final ExperienceModel experienceModel;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mediaQueryData = MediaQuery.of(context);
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    final orientation = mediaQueryData.orientation;

    Widget experienceWidget({
      required bool isRight,
    }) {
      return Padding(
        padding: orientation == Orientation.landscape
            ? EdgeInsets.zero
            : const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: orientation == Orientation.landscape
              ? MainAxisAlignment.center
              : MainAxisAlignment.start,
          crossAxisAlignment:
              isRight ? CrossAxisAlignment.start : CrossAxisAlignment.end,
          children: [
            Text(
              experienceModel.position,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                  mediaQuerySize: width,
                  minSize: 16,
                  multiplier: 0.05,
                  maxSize: 30,
                ),
              ),
            ),
            const SizedBox(
              height: 8,
            ),
            ...experienceModel.achievements.map(
              (e) => Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment:
                      isRight ? MainAxisAlignment.start : MainAxisAlignment.end,
                  children: [
                    Icon(
                      Icons.check,
                      size: DeviceUtils.minMaxSizeWithMediaQuery(
                        mediaQuerySize: width,
                        minSize: 16,
                        multiplier: 0.05,
                        maxSize: 20,
                      ),
                    ),
                    const SizedBox(
                      width: 8,
                    ),
                    Flexible(
                      child: Text(
                        e,
                        style: TextStyle(
                          height: 1.2,
                          fontWeight: FontWeight.w300,
                          fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                            mediaQuerySize: width,
                            minSize: 16,
                            multiplier: 0.05,
                            maxSize: 20,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Wrap(
                runSpacing: 8,
                spacing: 8,
                children: experienceModel.techStacks.map(
                  (e) {
                    final backgroundColor =
                        switch (ThemeData.estimateBrightnessForColor(e.color)) {
                      Brightness.dark => Colors.white,
                      Brightness.light => Colors.black,
                    };
                    return Chip(
                      label: Text(
                        e.name,
                        style: TextStyle(
                          color: e.color,
                        ),
                      ),
                      shape: const StadiumBorder(),
                      elevation: 0,
                      backgroundColor: backgroundColor,
                      avatar: CircleAvatar(
                        backgroundColor: Colors.white,
                        minRadius: 20,
                        child: Padding(
                          padding: const EdgeInsets.all(2),
                          child: Image.network(e.image),
                        ),
                      ),
                    );
                  },
                ).toList(),
              ),
            ),
          ],
        ),
      );
    }

    return experienceWidget(isRight: true);
  }
}
