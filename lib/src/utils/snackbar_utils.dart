import 'package:flutter/material.dart';

class SnackbarUtils {
  static GlobalKey<ScaffoldMessengerState> snackbarKey =
      GlobalKey<ScaffoldMessengerState>();

  static void showSuccessSnackbar({required String message}) {
    hideCurrentSnackbar();
    snackbarKey.currentState?.showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
      ),
    );
  }

  static void showErrorSnackbar({required String message}) {
    hideCurrentSnackbar();
    snackbarKey.currentState?.showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  static void showLoadinSnackbar({String message = 'Loading...'}) {
    hideCurrentSnackbar();
    snackbarKey.currentState?.showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const SizedBox.square(
              dimension: 26,
              child: FittedBox(
                child: CircularProgressIndicator(),
              ),
            ),
            const SizedBox(
              width: 10,
            ),
            Text(message),
          ],
        ),
      ),
    );
  }

  static void hideCurrentSnackbar() {
    snackbarKey.currentState?.hideCurrentSnackBar();
  }
}
