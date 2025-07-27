import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:portfolio/src/repositories/api_repository.dart';

class ApiCorsTestPage extends StatefulWidget {
  const ApiCorsTestPage({super.key});

  @override
  State<ApiCorsTestPage> createState() => _ApiCorsTestPageState();
}

class _ApiCorsTestPageState extends State<ApiCorsTestPage> {
  final ApiRepository repository = ApiRepository();

  String getResult = '';
  String postResult = '';
  String putResult = '';
  String deleteResult = '';

  final baseUrl = 'https://hapi-cors-test-production.up.railway.app';

  Future<void> testGet() async {
    try {
      final data = await repository.get('$baseUrl/api/test');
      setState(() {
        getResult = _formatJson(data);
      });
    } catch (error) {
      setState(() {
        getResult = 'Error: ${error.toString()}';
      });
    }
  }

  Future<void> testPost() async {
    try {
      final data = await repository.post(
        '$baseUrl/api/data',
        body: {'test': 'data', 'number': 42},
      );
      setState(() {
        postResult = _formatJson(data);
      });
    } catch (error) {
      setState(() {
        postResult = 'Error: ${error.toString()}';
      });
    }
  }

  Future<void> testPut() async {
    try {
      final data = await repository.put(
        '$baseUrl/api/data/123',
        body: {'updated': true, 'value': 'new data'},
        successCode:
            200, // Assuming PUT is handled as POST with different endpoint
      );
      setState(() {
        putResult = _formatJson(data);
      });
    } catch (error) {
      setState(() {
        putResult = 'Error: ${error.toString()}';
      });
    }
  }

  Future<void> testDelete() async {
    try {
      final data = await repository
          .delete('$baseUrl/api/data/123'); // Using GET as fallback
      setState(() {
        deleteResult = _formatJson(data);
      });
    } catch (error) {
      setState(() {
        deleteResult = 'Error: ${error.toString()}';
      });
    }
  }

  String _formatJson(dynamic data) {
    try {
      if (data is Map || data is List) {
        return const JsonEncoder.withIndent('  ').convert(data);
      }
      return data.toString();
    } catch (e) {
      return data.toString();
    }
  }

  Widget _buildTestSection({
    required String title,
    required VoidCallback onTest,
    required String result,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          ElevatedButton(
            onPressed: onTest,
            child: Text('Test $title'),
          ),
          if (result.isNotEmpty) ...[
            const SizedBox(height: 10),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(4),
              ),
              child: SelectableText(
                result,
                style: const TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hapi CORS Test'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Hapi CORS Test Server',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Server running on port 3000',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 20),
            _buildTestSection(
              title: 'GET Request Test',
              onTest: testGet,
              result: getResult,
            ),
            _buildTestSection(
              title: 'POST Request Test',
              onTest: testPost,
              result: postResult,
            ),
            _buildTestSection(
              title: 'PUT Request Test',
              onTest: testPut,
              result: putResult,
            ),
            _buildTestSection(
              title: 'DELETE Request Test',
              onTest: testDelete,
              result: deleteResult,
            ),
          ],
        ),
      ),
    );
  }
}
