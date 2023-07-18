import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:portfolio/src/models/experience_model.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/utils/device_utils.dart';

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
        crossAxisAlignment:
            isRight ? CrossAxisAlignment.start : CrossAxisAlignment.end,
        children: [
          Text(
            experienceModel.company,
            style: TextStyle(
              color: appTheme.getAlternatePrimaryColor(),
              fontWeight: FontWeight.bold,
              fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                mediaQuerySize: width,
                minSize: 16,
                multiplier: 0.07,
                maxSize: isLandscape ? 40 : 30,
              ),
            ),
          ),
          Text(
            "${DateFormat("MMMM yyyy").format(experienceModel.startDate)} - ${experienceModel.endDate == null ? "Present" : DateFormat("MMMM yyyy").format(experienceModel.endDate!)}",
            style: TextStyle(
              fontWeight: FontWeight.w300,
              fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                mediaQuerySize: width,
                minSize: 14,
                multiplier: 0.04,
                maxSize: 18,
              ),
            ),
          ),
          Text(
            experienceModel.location,
            style: TextStyle(
              fontWeight: FontWeight.w100,
              fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                mediaQuerySize: width,
                minSize: 14,
                multiplier: 0.04,
                maxSize: 18,
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
                  minSize: 14,
                  multiplier: 0.06,
                  maxSize: 24,
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
                        minSize: 12,
                        multiplier: 0.04,
                        maxSize: 16,
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
                            minSize: 12,
                            multiplier: 0.04,
                            maxSize: 16,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            )
          ],
        ),
      );
    }

    return experienceWidget(isRight: true);
  }
}
